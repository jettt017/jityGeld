"use client";

import { useState, useEffect } from "react";
import { ChevronDown, LineChart, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils";
import type { MonthlyData } from "@/types";
import Link from "next/link";

interface MainAnalyticsChartProps {
  data: MonthlyData[];
}

export function MainAnalyticsChart({ data }: MainAnalyticsChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Determine if there is sufficient transaction data (at least 2 months with income/expense)
  const realDataMonths = data.filter((d) => d.income > 0 || d.expense > 0);
  const hasSufficientData = realDataMonths.length >= 2;

  const chartData = data.map((d) => ({
    month: d.month,
    income: d.income,
    expense: d.expense,
  }));

  const currentMonthExpenses = chartData[chartData.length - 1]?.expense || 0;

  return (
    <Card className="rounded-[32px] border-none shadow-sm bg-card p-6 flex flex-col gap-4 w-full h-full justify-between">
      <div className="space-y-4">
        {/* Header with selector */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Expenses & Income</h3>
            {hasSufficientData && (
              <p className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">
                {formatCurrency(currentMonthExpenses)}
              </p>
            )}
          </div>
          {hasSufficientData && (
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold hover:bg-muted/40 transition-colors">
              Options <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Main Area Chart / Empty State */}
      <div className="h-64" style={{ width: "100%", height: 256, minWidth: 0, minHeight: 256 }}>
        {hasSufficientData ? (
          isMounted ? (
            <ResponsiveContainer width="100%" height={256} minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76a5ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#76a5ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e2e2e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2e2e2e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(v)
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: unknown) => [formatCurrency(Number(value))]}
                />
                {/* Income Trend Area (Light Blue) */}
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#76a5ff"
                  strokeWidth={2.5}
                  fill="url(#incomeGradMain)"
                  dot={false}
                />
                {/* Expense Trend Area (Dark Charcoal) */}
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#2e2e2e"
                  strokeWidth={2.5}
                  fill="url(#expenseGradMain)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-muted/10 animate-pulse rounded-[24px]" />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-[24px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
              <LineChart className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">
              No analytics available yet.
            </p>
            <p className="text-xs text-muted-foreground max-w-[300px] mb-4 leading-normal">
              Add transactions across multiple months to unlock analytics.
            </p>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Transaction
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
