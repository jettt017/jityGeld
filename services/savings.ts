import { prisma } from "@/lib/prisma";

export async function getSavingsGoals(userId: string) {
  return prisma.savingsGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSavingsGoalById(id: string, userId: string) {
  return prisma.savingsGoal.findFirst({
    where: { id, userId },
  });
}
