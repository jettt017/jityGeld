"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { CalendarCell } from "./calendar-cell";
import type { CalendarDayData } from "@/services/calendar";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentMonth: Date;
  days: Record<string, CalendarDayData>;
  selectedDate: string | null;
  filter: string;
  onSelectDate: (dateKey: string) => void;
}

export function CalendarGrid({
  currentMonth,
  days,
  selectedDate,
  filter,
  onSelectDate,
}: CalendarGridProps) {
  // Build full grid: Monday-based weeks
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="flex flex-col gap-1">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          return (
            <CalendarCell
              key={key}
              date={date}
              currentMonth={currentMonth}
              dayData={days[key]}
              isSelected={selectedDate === key}
              filter={filter}
              onClick={() => onSelectDate(key)}
            />
          );
        })}
      </div>
    </div>
  );
}
