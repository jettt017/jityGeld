import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/utils";

export async function getCategories(userId: string) {
  const cats = await prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { transactions: true } },
    },
  });
  return serializeData(cats);
}

export async function getCategoryById(id: string, userId: string) {
  const cat = await prisma.category.findFirst({
    where: { id, userId },
  });
  return serializeData(cat);
}

export async function getCategoriesByType(userId: string, type: "INCOME" | "EXPENSE") {
  const cats = await prisma.category.findMany({
    where: { userId, type },
    orderBy: { name: "asc" },
  });
  return serializeData(cats);
}
