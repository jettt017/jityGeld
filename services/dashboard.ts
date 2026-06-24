import { prisma } from "@/lib/prisma";
import type { DashboardStats, MonthlyData, CategoryExpense } from "@/types";
import { CHART_COLORS } from "@/utils";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [incomeResult, expenseResult, savingsResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    prisma.savingsGoal.aggregate({
      where: { userId },
      _sum: { currentAmount: true },
    }),
  ]);

  const totalIncome = Number(incomeResult._sum.amount || 0);
  const totalExpense = Number(expenseResult._sum.amount || 0);
  const totalSavings = Number(savingsResult._sum.currentAmount || 0);

  return {
    totalBalance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    totalSavings,
  };
}

export async function getMonthlyData(userId: string): Promise<MonthlyData[]> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: { gte: sixMonthsAgo },
    },
    select: {
      amount: true,
      type: true,
      transactionDate: true,
    },
    orderBy: { transactionDate: "asc" },
  });

  const monthlyMap = new Map<string, { income: number; expense: number }>();

  // Initialize all 6 months
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const key = d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    monthlyMap.set(key, { income: 0, expense: 0 });
  }

  for (const tx of transactions) {
    const date = new Date(tx.transactionDate);
    const key = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    const current = monthlyMap.get(key) || { income: 0, expense: 0 };
    if (tx.type === "INCOME") {
      current.income += Number(tx.amount);
    } else {
      current.expense += Number(tx.amount);
    }
    monthlyMap.set(key, current);
  }

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    ...data,
  }));
}

export async function getExpenseByCategory(userId: string): Promise<CategoryExpense[]> {
  const result = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE" },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 8,
  });

  if (result.length === 0) return [];

  const categoryIds = result.map((r) => r.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return result.map((r, i) => ({
    name: categoryMap.get(r.categoryId) || "Unknown",
    amount: Number(r._sum.amount || 0),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

export async function getRecentTransactions(userId: string, limit = 5) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: { select: { name: true, type: true } } },
    orderBy: { transactionDate: "desc" },
    take: limit,
  });
}
