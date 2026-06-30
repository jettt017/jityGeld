"use client";

import { TrendingUp, TrendingDown, DollarSign, Hash } from "lucide-react";
import { formatCurrency } from "@/utils";

interface CalendarSummaryProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalTransactions: number;
  monthLabel: string;
}

const cards = [
  {
    key: "totalIncome" as const,
    label: "Total Income",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "totalExpense" as const,
    label: "Total Expense",
    icon: TrendingDown,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "netBalance" as const,
    label: "Net Balance",
    icon: DollarSign,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "totalTransactions" as const,
    label: "Transactions",
    icon: Hash,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    format: (v: number) => String(v),
  },
];

export function CalendarSummary({
  totalIncome,
  totalExpense,
  netBalance,
  totalTransactions,
}: CalendarSummaryProps) {
  const values = { totalIncome, totalExpense, netBalance, totalTransactions };

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color, bg, format }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
            <div className={`rounded-lg p-1.5 ${bg}`}>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
          </div>
          <div
            className={`text-xl font-bold tracking-tight ${
              key === "netBalance"
                ? values[key] >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
                : "text-foreground"
            }`}
          >
            {format(values[key])}
          </div>
        </div>
      ))}
    </div>
  );
}
