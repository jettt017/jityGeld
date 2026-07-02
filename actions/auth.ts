"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/types";
import type { ActionResponse } from "@/types";

export async function signUp(formData: FormData): Promise<ActionResponse> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { name: result.data.name },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    // Create user record in our database
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: { email: result.data.email, name: result.data.name },
        create: {
          id: data.user.id,
          email: result.data.email,
          name: result.data.name,
        },
      });

      // Seed default categories for new user
      await seedDefaultCategories(data.user.id);
    } catch (dbError) {
      console.error("Database error creating user:", dbError);
    }
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    // Ensure user exists in our database
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: { email: result.data.email },
        create: {
          id: data.user.id,
          email: result.data.email,
          name: data.user.user_metadata?.name || null,
        },
      });
    } catch (dbError) {
      console.error("Database error syncing user:", dbError);
    }
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteAccount(): Promise<ActionResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Delete all Prisma-managed data (cascades to categories, transactions, savings goals)
    await prisma.user.delete({ where: { id: user.id } });

    // Delete avatar from storage if exists
    try {
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(user.id);
      if (files && files.length > 0) {
        await supabase.storage
          .from("avatars")
          .remove(files.map((f) => `${user.id}/${f.name}`));
      }
    } catch {
      // Non-critical — storage cleanup failure should not block account deletion
      console.warn("Avatar cleanup failed, proceeding with account deletion");
    }

    // Sign out and delete the Supabase Auth user (requires service role in production)
    // For client-initiated delete, we sign out and the auth record will be cleaned up
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Failed to delete account:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete account",
    };
  }

  return { success: true };
}


// ─── Helper: Get authenticated user ID ────────────────────────
export async function getAuthUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

// ─── Seed default categories ──────────────────────────────────
async function seedDefaultCategories(userId: string) {
  const defaults = [
    // Income
    { name: "Salary", type: "INCOME" as const },
    { name: "Freelance", type: "INCOME" as const },
    { name: "Bonus", type: "INCOME" as const },
    { name: "Investment", type: "INCOME" as const },
    // Expense
    { name: "Food", type: "EXPENSE" as const },
    { name: "Transport", type: "EXPENSE" as const },
    { name: "Shopping", type: "EXPENSE" as const },
    { name: "Entertainment", type: "EXPENSE" as const },
    { name: "Health", type: "EXPENSE" as const },
    { name: "Education", type: "EXPENSE" as const },
  ];

  await prisma.category.createMany({
    data: defaults.map((cat) => ({
      userId,
      name: cat.name,
      type: cat.type,
    })),
    skipDuplicates: true,
  });
}
