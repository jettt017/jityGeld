// ─── Shared types & helpers for the Export feature ─────────────────────────

export type ExportFormat = "excel" | "pdf" | "csv";

export type ExportRange = "weekly" | "monthly" | "yearly" | "custom";

export interface ExportOptions {
  format: ExportFormat;
  range: ExportRange;
  customStartDate?: string; // YYYY-MM-DD
  customEndDate?: string;   // YYYY-MM-DD
  categoryId?: string;      // undefined = all
  type?: "INCOME" | "EXPENSE"; // undefined = all
  includeNotes: boolean;
  includeCategory: boolean;
  includeDate: boolean;
  includeSummary: boolean;  // Sheet 2 for Excel / Summary page for PDF
}

export interface ExportTransaction {
  id: string;
  transactionDate: string;   // ISO YYYY-MM-DD
  categoryName: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string | null;
  createdAt: string;         // ISO string
}

export interface ExportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalTransactions: number;
  mostUsedCategory: string;
  largestExpense: number;
  largestIncome: number;
  exportDate: string;
  period: string;
}

/**
 * Generate a standard filename for the export.
 * e.g. JityGeld_Transactions_June_2026.xlsx
 */
export function generateFilename(
  format: ExportFormat,
  range: ExportRange,
  customStart?: string,
  customEnd?: string
): string {
  const ext = format === "excel" ? "xlsx" : format === "pdf" ? "pdf" : "csv";
  const docType = format === "pdf" ? "Report" : "Transactions";

  const now = new Date();
  let period: string;

  if (range === "custom" && customStart && customEnd) {
    period = `${customStart}_to_${customEnd}`;
  } else if (range === "weekly") {
    period = `Week_${now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).replace(/,?\s+/g, "_")}`;
  } else if (range === "yearly") {
    period = String(now.getFullYear());
  } else {
    // monthly
    period = now.toLocaleDateString("en-US", { year: "numeric", month: "long" }).replace(" ", "_");
  }

  return `JityGeld_${docType}_${period}.${ext}`;
}

/**
 * Calculate date range boundaries from an ExportRange.
 */
export function getDateRange(
  range: ExportRange,
  customStart?: string,
  customEnd?: string
): { startDate: Date; endDate: Date } {
  const now = new Date();

  if (range === "custom" && customStart && customEnd) {
    return {
      startDate: new Date(customStart),
      endDate: new Date(customEnd),
    };
  }

  if (range === "weekly") {
    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff + 6, 23, 59, 59));
    return { startDate: start, endDate: end };
  }

  if (range === "monthly") {
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    };
  }

  // yearly
  return {
    startDate: new Date(now.getFullYear(), 0, 1),
    endDate: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
  };
}

/**
 * Build a human-readable period label.
 */
export function getPeriodLabel(
  range: ExportRange,
  customStart?: string,
  customEnd?: string
): string {
  const now = new Date();

  if (range === "custom" && customStart && customEnd) {
    return `${customStart} to ${customEnd}`;
  }
  if (range === "weekly") {
    return `Week of ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  }
  if (range === "yearly") {
    return String(now.getFullYear());
  }
  return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Format a number as IDR currency string for exports.
 */
export function formatCurrencyExport(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compute a summary object from an array of export transactions.
 */
export function computeSummary(
  transactions: ExportTransaction[],
  range: ExportRange,
  customStart?: string,
  customEnd?: string
): ExportSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  let largestExpense = 0;
  let largestIncome = 0;
  const categoryCount: Record<string, number> = {};

  for (const tx of transactions) {
    if (tx.type === "INCOME") {
      totalIncome += tx.amount;
      if (tx.amount > largestIncome) largestIncome = tx.amount;
    } else {
      totalExpense += tx.amount;
      if (tx.amount > largestExpense) largestExpense = tx.amount;
    }
    categoryCount[tx.categoryName] = (categoryCount[tx.categoryName] || 0) + 1;
  }

  const mostUsedCategory =
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    totalTransactions: transactions.length,
    mostUsedCategory,
    largestExpense,
    largestIncome,
    exportDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    period: getPeriodLabel(range, customStart, customEnd),
  };
}
