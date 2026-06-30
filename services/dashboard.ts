// Added getActiveSavingsGoal to fetch the active savings goal for the dashboard
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

export async function getMonthlyTrend(userId: string, monthsCount: number = 6): Promise<MonthlyData[]> {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setMonth(startDate.getMonth() - (monthsCount - 1));
  startDate.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: { gte: startDate },
    },
    select: {
      amount: true,
      type: true,
      transactionDate: true,
    },
    orderBy: { transactionDate: "asc" },
  });

  const monthlyMap = new Map<string, { income: number; expense: number }>();

  // Initialize months in order
  for (let i = 0; i < monthsCount; i++) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (monthsCount - 1 - i));
    const key = d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    monthlyMap.set(key, { income: 0, expense: 0 });
  }

  for (const tx of transactions) {
    const date = new Date(tx.transactionDate);
    const key = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    const current = monthlyMap.get(key);
    if (current) {
      if (tx.type === "INCOME") {
        current.income += Number(tx.amount);
      } else {
        current.expense += Number(tx.amount);
      }
      monthlyMap.set(key, current);
    }
  }

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    ...data,
  }));
}

export async function getMonthlyData(userId: string): Promise<MonthlyData[]> {
  return getMonthlyTrend(userId, 6);
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
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: { select: { name: true, type: true } } },
    orderBy: { transactionDate: "desc" },
    take: limit,
  });

  return transactions.map(tx => ({
    ...tx,
    amount: Number(tx.amount),
  }));
}

export async function getActiveSavingsGoal(userId: string) {
  const goal = await prisma.savingsGoal.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!goal) return null;

  return {
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
  };
}
