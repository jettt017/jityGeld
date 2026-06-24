import { cn } from "@/lib/utils";

/**
 * Format a number as currency (IDR).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date as YYYY-MM-DD for form inputs.
 */
export function formatDateInput(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

/**
 * Calculate percentage.
 */
export function calculatePercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

/**
 * Chart color palette for consistent colors across charts.
 */
export const CHART_COLORS = [
  "hsl(160, 60%, 45%)", // teal
  "hsl(200, 70%, 50%)", // blue
  "hsl(280, 60%, 55%)", // purple
  "hsl(340, 65%, 55%)", // pink
  "hsl(30, 80%, 55%)",  // orange
  "hsl(60, 70%, 50%)",  // yellow
  "hsl(120, 50%, 45%)", // green
  "hsl(220, 60%, 55%)", // indigo
  "hsl(0, 65%, 55%)",   // red
  "hsl(180, 55%, 45%)", // cyan
];

export { cn };
