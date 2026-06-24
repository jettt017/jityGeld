import { prisma } from "@/lib/prisma";

export async function getCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { transactions: true } },
    },
  });
}

export async function getCategoryById(id: string, userId: string) {
  return prisma.category.findFirst({
    where: { id, userId },
  });
}

export async function getCategoriesByType(userId: string, type: "INCOME" | "EXPENSE") {
  return prisma.category.findMany({
    where: { userId, type },
    orderBy: { name: "asc" },
  });
}
