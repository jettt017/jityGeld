"use server";

import { getAuthUserId } from "./auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string) {
  try {
    const userId = await getAuthUserId();
    
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: message };
  }
}
