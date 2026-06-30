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
  let txCount = 0;

  if (dayData && isCurrentMonth) {
    let visibleTxs = dayData.transactions;

    if (filter === "INCOME") visibleTxs = visibleTxs.filter((t) => t.type === "INCOME");
    else if (filter === "EXPENSE") visibleTxs = visibleTxs.filter((t) => t.type === "EXPENSE");
    else if (filter.startsWith("CAT:")) {
      const catId = filter.slice(4);
      visibleTxs = visibleTxs.filter((t) => t.categoryId === catId);
    }

    txCount = visibleTxs.length;
    showIncome = visibleTxs.some(t => t.type === "INCOME");
    showExpense = visibleTxs.some(t => t.type === "EXPENSE");
  }

  const hasActivity = showIncome || showExpense;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-2 aspect-square rounded-[14px] border border-border/40 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
        // base
        isCurrentMonth ? "bg-card hover:shadow-sm hover:border-border/80" : "bg-muted/10 border-transparent opacity-40",
        // selected
        isSelected && isCurrentMonth && "bg-primary border-primary text-primary-foreground hover:bg-primary/90",
        // not selected but today
        !isSelected && today && "border-primary/50"
      )}
    >
      <div className="flex w-full items-start justify-between">
        {/* Date number */}
        <span
          className={cn(
            "text-sm font-semibold tracking-tight transition-colors",
            isSelected
              ? "text-primary-foreground"
              : today
              ? "text-primary"
              : isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {format(date, "d")}
        </span>

        {/* Multiple transactions badge */}
        {hasActivity && txCount > 2 && (
          <span
            className={cn(
              "text-[9px] font-bold px-1 rounded-sm",
              isSelected
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            +{txCount}
          </span>
        )}
      </div>

      {/* Financial indicators (dots) */}
      {hasActivity && (
        <div className="mt-auto flex items-center gap-1">
          {showIncome && (
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isSelected ? "bg-primary-foreground" : "bg-emerald-500"
              )}
            />
          )}
          {showExpense && (
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isSelected ? "bg-primary-foreground/70" : "bg-rose-500"
              )}
            />
          )}
        </div>
      )}
    </button>
  );
}
