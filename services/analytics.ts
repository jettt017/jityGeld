import { prisma } from "@/lib/prisma";
import { CHART_COLORS } from "@/utils";
import { getMonthlyTrend } from "./dashboard";

export async function getMonthlyIncomeTrend(userId: string) {
  const trend = await getMonthlyTrend(userId, 12);
  return trend.map((t) => ({
    month: t.month,
    amount: t.income,
  }));
}

export async function getMonthlyExpenseTrend(userId: string) {
  const trend = await getMonthlyTrend(userId, 12);
  return trend.map((t) => ({
    month: t.month,
    amount: t.expense,
  }));
}

export async function getExpenseDistribution(userId: string) {
  const result = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE" },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
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
    value: Number(r._sum.amount || 0),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

export async function getSavingsProgress(userId: string) {
  const goals = await prisma.savingsGoal.findMany({
    where: { userId },
    select: {
      title: true,
      targetAmount: true,
      currentAmount: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return goals.map((g, i) => ({
    name: g.title,
    target: Number(g.targetAmount),
    current: Number(g.currentAmount),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

export async function getAnalyticsStats(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalIncome, totalExpense, monthlyIncome, monthlyExpense] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME", transactionDate: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", transactionDate: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  // Get largest expense category
  const largestCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE" },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 1,
  });

  let largestCategoryName = "N/A";
  if (largestCategory.length > 0) {
    const cat = await prisma.category.findUnique({
      where: { id: largestCategory[0].categoryId },
      select: { name: true },
    });
    largestCategoryName = cat?.name || "Unknown";
  }

  // Average monthly expense (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthExpense = await prisma.transaction.aggregate({
    where: { userId, type: "EXPENSE", transactionDate: { gte: sixMonthsAgo } },
    _sum: { amount: true },
  });

  return {
    totalIncome: Number(totalIncome._sum.amount || 0),
    totalExpense: Number(totalExpense._sum.amount || 0),
    monthlyBalance:
      Number(monthlyIncome._sum.amount || 0) -
      Number(monthlyExpense._sum.amount || 0),
    largestCategory: largestCategoryName,
    avgMonthlyExpense: Math.round(
      Number(sixMonthExpense._sum.amount || 0) / 6
    ),
  };
}

