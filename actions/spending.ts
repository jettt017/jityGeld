"use server";

import { getAuthUserId } from "./auth";
import { prisma } from "@/lib/prisma";

export type TimeRange = "weekly" | "monthly" | "yearly";

export async function getSpendingData(range: TimeRange) {
  try {
    const userId = await getAuthUserId();
    const now = new Date();

    let startDate: Date;
    let prevStartDate: Date;
    let prevEndDate: Date;

    let chartData: { name: string; amount: number }[] = [];

    if (range === "weekly") {
      // Current Week: Mon to Sun (UTC)
      const day = now.getUTCDay();
      const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
      
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0, 0));
      
      // Previous Week: Mon to Sun
      prevStartDate = new Date(startDate);
      prevStartDate.setUTCDate(startDate.getUTCDate() - 7);
      
      prevEndDate = new Date(startDate);
      prevEndDate.setUTCMilliseconds(-1);

      // Initialize days Mon-Sun
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      chartData = daysOfWeek.map((name) => ({ name, amount: 0 }));
    } else if (range === "monthly") {
      // Current Month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      
      // Previous Month
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      
      prevEndDate = new Date(startDate);
      prevEndDate.setMilliseconds(-1);

      // Initialize weeks Week 1-4
      const weeksOfMonth = ["Week 1", "Week 2", "Week 3", "Week 4"];
      chartData = weeksOfMonth.map((name) => ({ name, amount: 0 }));
    } else {
      // Yearly
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      
      // Previous Year
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
      
      prevEndDate = new Date(startDate);
      prevEndDate.setMilliseconds(-1);

      // Initialize months Jan-Dec
      const monthsOfYear = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      chartData = monthsOfYear.map((name) => ({ name, amount: 0 }));
    }

    // Fetch transactions from prevStartDate to current end date (now)
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        transactionDate: {
          gte: prevStartDate,
        },
      },
      select: {
        amount: true,
        transactionDate: true,
      },
    });

    let currentTotal = 0;
    let prevTotal = 0;

    for (const tx of transactions) {
      const txDate = new Date(tx.transactionDate);
      const amount = Number(tx.amount);

      if (txDate >= startDate) {
        // Current period
        currentTotal += amount;

        if (range === "weekly") {
          const txDay = txDate.getUTCDay(); // 0 is Sun, 1 is Mon...
          const index = (txDay + 6) % 7;
          if (chartData[index]) {
            chartData[index].amount += amount;
          }
        } else if (range === "monthly") {
          const dayOfMonth = txDate.getDate();
          let index = 0;
          if (dayOfMonth <= 7) index = 0;
          else if (dayOfMonth <= 14) index = 1;
          else if (dayOfMonth <= 21) index = 2;
          else index = 3;
          if (chartData[index]) {
            chartData[index].amount += amount;
          }
        } else {
          const monthIndex = txDate.getMonth(); // 0 is Jan
          if (chartData[monthIndex]) {
            chartData[monthIndex].amount += amount;
          }
        }
      } else if (txDate >= prevStartDate && txDate <= prevEndDate) {
        // Previous period
        prevTotal += amount;
      }
    }

    // Calculate percentage change compared to previous period
    const delta =
      prevTotal > 0
        ? ((currentTotal - prevTotal) / prevTotal) * 100
        : 0;
    const isDown = delta <= 0;

    return {
      success: true,
      data: {
        currentTotal,
        delta: Math.abs(delta),
        isDown,
        chartData,
      },
    };
  } catch (error) {
    console.error("Failed to fetch spending data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load spending details",
    };
  }
}
