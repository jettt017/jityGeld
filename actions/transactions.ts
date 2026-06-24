"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/actions/auth";
import { transactionSchema } from "@/types";
import type { ActionResponse } from "@/types";

export async function createTransaction(formData: FormData): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    categoryId: formData.get("categoryId") as string,
    amount: formData.get("amount") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    transactionDate: formData.get("transactionDate") as string,
  };

  const result = transactionSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: result.data.categoryId, userId },
    });
    if (!category) {
      return { success: false, error: "Invalid category" };
    }

    await prisma.transaction.create({
      data: {
        userId,
        categoryId: result.data.categoryId,
        amount: result.data.amount,
        type: result.data.type,
        description: result.data.description || null,
        transactionDate: new Date(result.data.transactionDate),
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("Create transaction error:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

export async function updateTransaction(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    categoryId: formData.get("categoryId") as string,
    amount: formData.get("amount") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    transactionDate: formData.get("transactionDate") as string,
  };

  const result = transactionSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return { success: false, error: "Transaction not found" };
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        categoryId: result.data.categoryId,
        amount: result.data.amount,
        type: result.data.type,
        description: result.data.description || null,
        transactionDate: new Date(result.data.transactionDate),
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("Update transaction error:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

export async function deleteTransaction(id: string): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return { success: false, error: "Transaction not found" };
    }

    await prisma.transaction.delete({ where: { id } });
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");
    return { success: true };
  } catch (error) {
    console.error("Delete transaction error:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}
