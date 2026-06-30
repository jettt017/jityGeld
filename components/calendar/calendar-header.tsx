"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  filter: string;
  categories: { id: string; name: string }[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onFilterChange: (filter: string) => void;
}

export function CalendarHeader({
  currentDate,
  filter,
  categories,
  onPrev,
  onNext,
  onToday,
  onFilterChange,
}: CalendarHeaderProps) {
  const btnBase =
    "inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/50 bg-card text-muted-foreground shadow-sm transition-all duration-150 hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: month navigation */}
      <div className="flex items-center gap-2">
        <button id="cal-prev" type="button" onClick={onPrev} className={btnBase} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 min-w-[9rem] justify-center">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="text-base font-bold tracking-tight">
            {format(currentDate, "MMMM yyyy")}
          </span>
        </div>

        <button id="cal-next" type="button" onClick={onNext} className={btnBase} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          id="cal-today"
          type="button"
          onClick={onToday}
          className="inline-flex items-center h-8 rounded-lg border border-border/50 bg-card px-3 text-xs font-semibold text-muted-foreground shadow-sm transition-all duration-150 hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Today
        </button>
      </div>

      {/* Right: filter */}
      <div className="flex items-center gap-2">
        <select
          id="cal-filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="flex h-8 rounded-lg border border-border/50 bg-card px-3 text-xs font-semibold text-foreground shadow-sm transition-all duration-150 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="ALL">All Transactions</option>
          <option value="INCOME">Income Only</option>
          <option value="EXPENSE">Expense Only</option>
          {categories.map((cat) => (
            <option key={cat.id} value={`CAT:${cat.id}`}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
