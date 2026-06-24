"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/actions/auth";
import { categorySchema } from "@/types";
import type { ActionResponse } from "@/types";

export async function createCategory(formData: FormData): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
  };

  const result = categorySchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.category.create({
      data: {
        userId,
        name: result.data.name,
        type: result.data.type,
      },
    });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  const raw = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
  };

  const result = categorySchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const existing = await prisma.category.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    await prisma.category.update({
      where: { id },
      data: {
        name: result.data.name,
        type: result.data.type,
      },
    });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  const userId = await getAuthUserId();

  try {
    const existing = await prisma.category.findFirst({
      where: { id, userId },
      include: { _count: { select: { transactions: true } } },
    });
    if (!existing) {
      return { success: false, error: "Category not found" };
    }
    if (existing._count.transactions > 0) {
      return {
        success: false,
        error: `Cannot delete: ${existing._count.transactions} transactions use this category`,
      };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
