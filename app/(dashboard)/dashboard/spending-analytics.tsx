"use client";

import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, BarChart3, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/utils";
import { getSpendingData, type TimeRange } from "@/actions/spending";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface SpendingAnalyticsProps {
  monthlyData: unknown; // Kept for interface compatibility
  hasTransactions: boolean; // Kept for interface compatibility
}

const CHART_H = 196;

export function SpendingAnalyticsCard({}: SpendingAnalyticsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [range, setRange] = useState<TimeRange>("monthly");
  const [loading, setLoading] = useState(true);
  const [spendingData, setSpendingData] = useState<{
    currentTotal: number;
    delta: number;
    isDown: boolean;
    chartData: { name: string; amount: number }[];
  } | null>(null);

  // Hydration sync & load persisted choice
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const persisted = localStorage.getItem("spending_range");
    if (persisted === "weekly" || persisted === "monthly" || persisted === "yearly") {
      setRange(persisted as TimeRange);
    }
  }, []);

  // Fetch spending data when range changes
  useEffect(() => {
    if (!isMounted) return;

    localStorage.setItem("spending_range", range);

    async function loadSpending() {
      setLoading(true);
      const result = await getSpendingData(range);
      if (result.success && result.data) {
        setSpendingData(result.data);
      }
      setLoading(false);
    }

    loadSpending();
  }, [range, isMounted]);

  // Compute active column highlight index according to calendar date
  const getActiveBarIndex = () => {
    const now = new Date();
    if (range === "weekly") {
      // 0 is Sun, 1 is Mon...
      return (now.getDay() + 6) % 7;
    } else if (range === "monthly") {
      const dayOfMonth = now.getDate();
      if (dayOfMonth <= 7) return 0;
      if (dayOfMonth <= 14) return 1;
      if (dayOfMonth <= 21) return 2;
      return 3;
    } else {
      return now.getMonth(); // 0 is Jan
    }
  };

  const activeBarIndex = getActiveBarIndex();

  // Initial SSR skeleton placeholder to prevent layout shifts
  if (!isMounted) {
    return (
      <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-5 flex flex-col h-full w-full justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="space-y-3 mt-4 flex-1 flex flex-col justify-end">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <div className="h-32 w-full bg-muted/10 rounded-2xl" />
        </div>
      </Card>
    );
  }

  const hasData = spendingData && spendingData.currentTotal > 0;

  return (
    <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-5 flex flex-col h-full w-full justify-between">
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0 mb-2.5">
          <h3 className="text-sm font-semibold text-foreground">Spending</h3>
          <Select value={range} onValueChange={(v) => setRange(v as TimeRange)}>
            <SelectTrigger variant="outline">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent align="end" sideOffset={4} alignItemWithTrigger={false} className="w-[150px] p-[4px] rounded-lg border border-border bg-card shadow-md overflow-hidden flex flex-col gap-[1px] focus:outline-none">
              <SelectItem value="weekly" className="h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150 focus:outline-none flex items-center justify-between relative pr-7 data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:bg-blue-500/10 data-[selected]:text-blue-600 dark:data-[selected]:bg-blue-950/30 dark:data-[selected]:text-blue-400">Weekly</SelectItem>
              <SelectItem value="monthly" className="h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150 focus:outline-none flex items-center justify-between relative pr-7 data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:bg-blue-500/10 data-[selected]:text-blue-600 dark:data-[selected]:bg-blue-950/30 dark:data-[selected]:text-blue-400">Monthly</SelectItem>
              <SelectItem value="yearly" className="h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer transition-colors duration-150 focus:outline-none flex items-center justify-between relative pr-7 data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:bg-blue-500/10 data-[selected]:text-blue-600 dark:data-[selected]:bg-blue-950/30 dark:data-[selected]:text-blue-400">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          /* Shimmering Loading Graph State */
          <div className="flex-1 flex flex-col justify-between h-full">
            <Skeleton className="h-8 w-36 rounded-lg mt-2 mb-4 shrink-0" />
            <div style={{ width: "100%", height: CHART_H }} className="flex items-end justify-between gap-3 px-2 mt-auto">
              {Array.from({ length: range === "weekly" ? 7 : range === "monthly" ? 4 : 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full rounded-t-lg"
                  style={{ height: `${(i % 3) * 20 + 30}%` }}
                />
              ))}
            </div>
          </div>
        ) : hasData && spendingData ? (
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Amount + Delta */}
            <div className="flex items-baseline gap-2 mt-1 mb-4 shrink-0">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground leading-none">
                {formatCurrency(spendingData.currentTotal)}
              </h2>
              <div
                className={`flex items-center gap-0.5 text-[10px] font-bold ${
                  spendingData.isDown ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {spendingData.isDown ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {spendingData.isDown ? "" : "+"}
                {spendingData.delta.toFixed(1)}%
              </div>
            </div>

            {/* Recharts Bar Graph */}
            <div style={{ width: "100%", height: CHART_H, minWidth: 0, minHeight: CHART_H }} className="mt-auto">
              <ResponsiveContainer width="100%" height={CHART_H}>
                <BarChart
                  data={spendingData.chartData}
                  margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", fillOpacity: 0.25 }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      fontSize: "11px",
                    }}
                    formatter={(value: unknown) => [
                      formatCurrency(Number(value)),
                      "Spending",
                    ]}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={24} animationDuration={300}>
                    {spendingData.chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === activeBarIndex ? "#f43f5e" : "#fca5a5"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          /* Timeframe Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
              <BarChart3 className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-foreground mb-1">
              No spending data available.
            </p>
            <p className="text-[10px] text-muted-foreground max-w-[200px] mb-4 leading-normal">
              Try changing your time range or logging a new transaction to see your metrics.
            </p>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Record Expense
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
