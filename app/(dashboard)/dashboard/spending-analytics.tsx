"use client";

import { useState, useEffect } from "react";
import { ChevronDown, TrendingDown, TrendingUp, BarChart3, Plus } from "lucide-react";
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
import type { MonthlyData } from "@/types";
import Link from "next/link";

interface SpendingAnalyticsProps {
  monthlyData: MonthlyData[];
}

const CHART_H = 196;

export function SpendingAnalyticsCard({ monthlyData }: SpendingAnalyticsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Determine if we have sufficient spending data (at least 2 months with expense > 0)
  const realExpenseMonths = monthlyData.filter((d) => d.expense > 0);
  const hasSufficientExpenses = realExpenseMonths.length >= 2;

  const displayData = monthlyData.map((d) => {
    const match = d.month.match(/[a-zA-Z]+/);
    const monthName = match ? match[0] : d.month;
    return {
      month: monthName,
      amount: d.expense,
    };
  });

  const lastEntry = displayData[displayData.length - 1];
  const prevEntry = displayData[displayData.length - 2];
  const currentSpending = lastEntry?.amount ?? 0;
  const delta =
    prevEntry?.amount && prevEntry.amount > 0
      ? ((currentSpending - prevEntry.amount) / prevEntry.amount) * 100
      : 0;
  const isDown = delta <= 0;

  return (
    <Card className="rounded-2xl border-none shadow-sm bg-card p-5 flex flex-col h-full w-full justify-between">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0">
          <h3 className="text-sm font-semibold text-foreground">Spending</h3>
          {hasSufficientExpenses && (
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-semibold hover:bg-muted/40 transition-colors text-muted-foreground">
              Monthly <ChevronDown className="h-3 w-3" />
            </button>
          )}
        </div>

        {hasSufficientExpenses ? (
          <>
            {/* Amount + Delta */}
            <div className="flex items-baseline gap-2 mt-2.5 mb-4 shrink-0">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                {formatCurrency(currentSpending)}
              </h2>
              <div
                className={`flex items-center gap-0.5 text-[10px] font-bold ${
                  isDown ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isDown ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {isDown ? "" : "+"}
                {delta.toFixed(1)}%
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{ width: "100%", height: CHART_H, minWidth: 0, minHeight: CHART_H }} className="mt-auto">
              {isMounted ? (
                <ResponsiveContainer width="100%" height={CHART_H}>
                  <BarChart
                    data={displayData}
                    margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                    barCategoryGap="28%"
                  >
                    <XAxis
                      dataKey="month"
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
                    <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={24}>
                      {displayData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === displayData.length - 1 ? "#7ab4f5" : "#c8deff"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{ width: "100%", height: CHART_H }}
                  className="bg-muted/10 animate-pulse rounded-2xl"
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
              <BarChart3 className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-foreground mb-1">
              No spending history yet.
            </p>
            <p className="text-[10px] text-muted-foreground max-w-[200px] mb-4 leading-normal">
              Your spending history will build automatically as you start logging expenses.
            </p>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
            >
              <Plus className="h-3 w-3" /> Record Expense
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
