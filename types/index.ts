import { z } from "zod/v4";

// ─── Auth Schemas ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Category Schemas ─────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ─── Transaction Schemas ──────────────────────────────────────
export const transactionSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().optional(),
  transactionDate: z.string().min(1, "Date is required"),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// ─── Savings Goal Schemas ─────────────────────────────────────
export const savingsGoalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  targetAmount: z.coerce.number().positive("Target must be greater than 0"),
  deadline: z.string().optional(),
});

export const addFundsSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>;
export type AddFundsInput = z.infer<typeof addFundsSchema>;

// ─── Action Response ──────────────────────────────────────────
export type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ─── Utility Types ────────────────────────────────────────────
export type TransactionWithCategory = {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
  };
};

export type DashboardStats = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
};

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};

export type CategoryExpense = {
  name: string;
  amount: number;
  fill: string;
};
