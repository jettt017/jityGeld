"use server";

import { getAuthUserId } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import type { ExportOptions, ExportTransaction } from "@/lib/export";
import { getDateRange } from "@/lib/export";

export async function fetchExportTransactions(
  options: ExportOptions
): Promise<{ success: true; data: ExportTransaction[] } | { success: false; error: string }> {
  try {
    const userId = await getAuthUserId();

    const { startDate, endDate } = getDateRange(
      options.range,
      options.customStartDate,
      options.customEndDate
    );

    const where: Record<string, unknown> = {
      userId,
      transactionDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (options.type) {
      where.type = options.type;
    }

    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: { select: { name: true } },
      },
      orderBy: { transactionDate: "desc" },
    });

    const data: ExportTransaction[] = transactions.map((tx) => ({
      id: tx.id,
      transactionDate: tx.transactionDate.toISOString().split("T")[0],
      categoryName: tx.category.name,
      type: tx.type as "INCOME" | "EXPENSE",
      amount: Number(tx.amount),
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Export error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch export data",
    };
  }
}
