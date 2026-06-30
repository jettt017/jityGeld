import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/utils";

export async function getSavingsGoals(userId: string) {
  const goals = await prisma.savingsGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return serializeData(goals);
}

export async function getSavingsGoalById(id: string, userId: string) {
  const goal = await prisma.savingsGoal.findFirst({
    where: { id, userId },
  });
  return serializeData(goal);
}
