"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/actions/auth";
import { savingsGoalSchema, addFundsSchema } from "@/types";
import type { ActionResponse } from "@/types";

export async function createSavingsGoal(formData: FormData): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    title: formData.get("title") as string,
    targetAmount: formData.get("targetAmount") as string,
    deadline: formData.get("deadline") as string,
  };

  const result = savingsGoalSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.savingsGoal.create({
      data: {
        userId,
        title: result.data.title,
        targetAmount: result.data.targetAmount,
        deadline: result.data.deadline ? new Date(result.data.deadline) : null,
      },
    });

    revalidatePath("/savings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create savings goal error:", error);
    return { success: false, error: "Failed to create savings goal" };
  }
}

export async function updateSavingsGoal(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    title: formData.get("title") as string,
    targetAmount: formData.get("targetAmount") as string,
    deadline: formData.get("deadline") as string,
  };

  const result = savingsGoalSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return { success: false, error: "Savings goal not found" };
    }

    await prisma.savingsGoal.update({
      where: { id },
      data: {
        title: result.data.title,
        targetAmount: result.data.targetAmount,
        deadline: result.data.deadline ? new Date(result.data.deadline) : null,
      },
    });

    revalidatePath("/savings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update savings goal error:", error);
    return { success: false, error: "Failed to update savings goal" };
  }
}

export async function addFundsToGoal(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    amount: formData.get("amount") as string,
  };

  const result = addFundsSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return { success: false, error: "Savings goal not found" };
    }

    const newAmount = Number(existing.currentAmount) + result.data.amount;

    await prisma.savingsGoal.update({
      where: { id },
      data: { currentAmount: newAmount },
    });

    revalidatePath("/savings");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("Add funds error:", error);
    return { success: false, error: "Failed to add funds" };
  }
}

export async function deleteSavingsGoal(id: string): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return { success: false, error: "Savings goal not found" };
    }

    await prisma.savingsGoal.delete({ where: { id } });
    revalidatePath("/savings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete savings goal error:", error);
    return { success: false, error: "Failed to delete savings goal" };
  }
}
