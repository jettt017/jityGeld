"use server";

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/actions/auth";
import {
  startOfMonth,
  endOfMonth,
  parseISO,
  format,
} from "date-fns";

export interface CalendarTransaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  transactionDate: string; // YYYY-MM-DD
  categoryId: string;
  categoryName: string;
  categoryType: string;
  createdAt: string;
}

export interface CalendarDayData {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
  transactions: CalendarTransaction[];
}

export interface CalendarMonthData {
  days: Record<string, CalendarDayData>;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalTransactions: number;
}

/**
 * Fetch all transactions for a given month and group them by date.
 */
export async function getCalendarData(
  year: number,
  month: number // 1-indexed
): Promise<CalendarMonthData> {
  const userId = await getAuthUserId();

  const referenceDate = new Date(year, month - 1, 1);
  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: {
        gte: start,
        lte: end,
      },
    },
    include: {
      category: { select: { name: true, type: true } },
    },
    orderBy: { transactionDate: "asc" },
  });

  const days: Record<string, CalendarDayData> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    const dateKey = format(tx.transactionDate, "yyyy-MM-dd");
    const amount = Number(tx.amount);

    if (!days[dateKey]) {
      days[dateKey] = {
        date: dateKey,
        income: 0,
        expense: 0,
        transactions: [],
      };
    }

    const calTx: CalendarTransaction = {
      id: tx.id,
      amount,
      type: tx.type as "INCOME" | "EXPENSE",
      description: tx.description,
      transactionDate: dateKey,
      categoryId: tx.categoryId,
      categoryName: tx.category.name,
      categoryType: tx.category.type,
      createdAt: tx.createdAt.toISOString(),
    };

    days[dateKey].transactions.push(calTx);

    if (tx.type === "INCOME") {
      days[dateKey].income += amount;
      totalIncome += amount;
    } else {
      days[dateKey].expense += amount;
      totalExpense += amount;
    }
  }

  return {
    days,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalTransactions: transactions.length,
  };
}
