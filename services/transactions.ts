import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/utils";

type GetTransactionsParams = {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export async function getTransactions({
  userId,
  page = 1,
  limit = 10,
  search,
  type,
  categoryId,
  startDate,
  endDate,
}: GetTransactionsParams) {
  const where: Record<string, unknown> = { userId };
  const whereWithoutSearch: Record<string, unknown> = { userId };

  if (type) {
    where.type = type;
    whereWithoutSearch.type = type;
  }
  if (categoryId) {
    where.categoryId = categoryId;
    whereWithoutSearch.categoryId = categoryId;
  }
  if (startDate || endDate) {
    const dateRange: Record<string, unknown> = {};
    if (startDate) {
      dateRange.gte = new Date(startDate);
    }
    if (endDate) {
      dateRange.lte = new Date(endDate);
    }
    where.transactionDate = dateRange;
    whereWithoutSearch.transactionDate = dateRange;
  }

  if (search) {
    where.description = { contains: search, mode: "insensitive" };
  }

  const [transactions, total, incomeSum, expenseSum] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true, type: true } } },
      orderBy: { transactionDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.aggregate({
      where: { ...whereWithoutSearch, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...whereWithoutSearch, type: "EXPENSE" },
      _sum: { amount: true },
    }),
  ]);

  return {
    transactions: serializeData(transactions),
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalIncome: Number(incomeSum._sum.amount || 0),
    totalExpense: Number(expenseSum._sum.amount || 0),
  };
}

export async function getTransactionById(id: string, userId: string) {
  const tx = await prisma.transaction.findFirst({
    where: { id, userId },
    include: { category: true },
  });
  return serializeData(tx);
}
