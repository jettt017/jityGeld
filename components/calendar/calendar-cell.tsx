"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import { format, isToday, isSameMonth } from "date-fns";
import type { CalendarDayData } from "@/services/calendar";

interface CalendarCellProps {
  date: Date;
  currentMonth: Date;
  dayData?: CalendarDayData;
  isSelected: boolean;
  filter: string;
  onClick: () => void;
}

export function CalendarCell({
  date,
  currentMonth,
  dayData,
  isSelected,
  filter,
  onClick,
}: CalendarCellProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);

  // Compute visible income/expense based on filter
  let showIncome = false;
  let showExpense = false;
  let income = 0;
  let expense = 0;

  if (dayData && isCurrentMonth) {
    if (filter === "ALL") {
      income = dayData.income;
      expense = dayData.expense;
      showIncome = income > 0;
      showExpense = expense > 0;
    } else if (filter === "INCOME") {
      income = dayData.income;
      showIncome = income > 0;
    } else if (filter === "EXPENSE") {
      expense = dayData.expense;
      showExpense = expense > 0;
    } else if (filter.startsWith("CAT:")) {
      const catId = filter.slice(4);
      const catTxs = dayData.transactions.filter((t) => t.categoryId === catId);
      income = catTxs.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
      expense = catTxs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
      showIncome = income > 0;
      showExpense = expense > 0;
    }
  }

  const hasActivity = showIncome || showExpense;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start p-1.5 sm:p-2 min-h-[72px] sm:min-h-[90px] rounded-xl border text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20",
        // base
        isCurrentMonth
          ? "bg-card border-border/40 hover:border-primary/30 hover:bg-primary/5"
          : "bg-muted/20 border-border/20 opacity-50",
        // selected
        isSelected && isCurrentMonth && "border-primary/60 bg-primary/8 ring-2 ring-primary/20",
        // today
        today && "border-primary/40"
      )}
    >
      {/* Date number */}
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
          today
            ? "bg-primary text-primary-foreground"
            : isSelected
            ? "text-primary"
            : isCurrentMonth
            ? "text-foreground"
            : "text-muted-foreground/40"
        )}
      >
        {format(date, "d")}
      </div>

      {/* Financial indicators */}
      {hasActivity && (
        <div className="mt-1 flex flex-col gap-0.5 w-full min-w-0">
          {showIncome && (
            <span className="truncate text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">
              +{formatCurrency(income)}
            </span>
          )}
          {showExpense && (
            <span className="truncate text-[9px] sm:text-[10px] font-bold text-rose-500 leading-none">
              -{formatCurrency(expense)}
            </span>
          )}
        </div>
      )}

      {/* Activity dot (mobile fallback) */}
      {hasActivity && (
        <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary opacity-60 sm:hidden" />
      )}
    </button>
  );
}
