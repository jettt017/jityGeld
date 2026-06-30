"use client";

import { useState, useCallback, useTransition } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarSummary } from "@/components/calendar/calendar-summary";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { DayDetails } from "@/components/calendar/day-details";
import { fetchCalendarData } from "@/actions/calendar";
import type { CalendarMonthData } from "@/services/calendar";

interface Category {
  id: string;
  name: string;
  type: string;
}

interface CalendarClientProps {
  initialData: CalendarMonthData;
  initialYear: number;
  initialMonth: number;
  categories: Category[];
}

export function CalendarClient({
  initialData,
  initialYear,
  initialMonth,
  categories,
}: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date(initialYear, initialMonth - 1, 1));
  const [monthData, setMonthData] = useState<CalendarMonthData>(initialData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  // Show details panel (mobile bottom sheet or desktop side panel)
  const showDetails = selectedDate !== null;

  async function loadMonth(newDate: Date) {
    startTransition(async () => {
      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const data = await fetchCalendarData(year, month);
      setMonthData(data);
      setSelectedDate(null);
    });
  }

  const handlePrev = useCallback(() => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    loadMonth(newDate);
  }, [currentDate]);

  const handleNext = useCallback(() => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    loadMonth(newDate);
  }, [currentDate]);

  const handleToday = useCallback(() => {
    const today = new Date();
    const newDate = new Date(today.getFullYear(), today.getMonth(), 1);
    setCurrentDate(newDate);
    loadMonth(newDate);
  }, []);

  const handleSelectDate = useCallback((dateKey: string) => {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  }, []);

  const handleTransactionCreated = useCallback(async () => {
    const data = await fetchCalendarData(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setMonthData(data);
  }, [currentDate]);

  const monthLabel = format(currentDate, "MMMM yyyy");

  return (
    <div className="flex flex-col gap-5">
      {/* Summary cards */}
      <CalendarSummary
        totalIncome={monthData.totalIncome}
        totalExpense={monthData.totalExpense}
        netBalance={monthData.netBalance}
        totalTransactions={monthData.totalTransactions}
        monthLabel={monthLabel}
      />

      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        filter={filter}
        categories={categories}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onFilterChange={setFilter}
      />

      {/* Calendar body */}
      <div
        className={`flex gap-4 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Grid — takes remaining space */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-border/50 bg-card p-3 sm:p-4 shadow-sm">
            <CalendarGrid
              currentMonth={currentDate}
              days={monthData.days}
              selectedDate={selectedDate}
              filter={filter}
              onSelectDate={handleSelectDate}
            />
          </div>
        </div>

        {/* Desktop side panel (always shown as placeholder, populated when date selected) */}
        <div className="hidden lg:block w-72 xl:w-80 shrink-0">
          <DayDetails
            selectedDate={selectedDate}
            dayData={selectedDate ? monthData.days[selectedDate] : undefined}
            categories={categories}
            filter={filter}
            onClose={() => setSelectedDate(null)}
            onTransactionCreated={handleTransactionCreated}
          />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {showDetails && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedDate(null)}
          />
          {/* Sheet */}
          <div className="relative z-10 max-h-[75vh] overflow-y-auto rounded-t-2xl bg-background shadow-2xl">
            <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-border" />
            <DayDetails
              selectedDate={selectedDate}
              dayData={selectedDate ? monthData.days[selectedDate] : undefined}
              categories={categories}
              filter={filter}
              onClose={() => setSelectedDate(null)}
              onTransactionCreated={handleTransactionCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}
