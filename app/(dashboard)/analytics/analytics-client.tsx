"use client";

import { useState, useEffect } from "react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Tag,
  Calculator,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/utils";

interface TrendData {
  month: string;
  amount: number;
}

interface DistributionData {
  name: string;
  value: number;
  fill: string;
}

interface SavingsProgressData {
  name: string;
  target: number;
  current: number;
  fill: string;
}

interface Stats {
  totalIncome: number;
  totalExpense: number;
  monthlyBalance: number;
  largestCategory: string;
  avgMonthlyExpense: number;
}

interface AnalyticsClientProps {
  incomeTrend: TrendData[];
  expenseTrend: TrendData[];
  expenseDistribution: DistributionData[];
  savingsProgress: SavingsProgressData[];
  stats: Stats;
}

const formatCompact = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
  }).format(v);

const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export function AnalyticsClient({
  incomeTrend,
  expenseTrend,
  expenseDistribution,
  savingsProgress,
  stats,
}: AnalyticsClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const statCards = [
    {
      title: "Total Income",
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Expense",
      value: formatCurrency(stats.totalExpense),
      icon: TrendingDown,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Monthly Balance",
      value: formatCurrency(stats.monthlyBalance),
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Largest Category",
      value: stats.largestCategory,
      icon: Tag,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      isText: true,
    },
    {
      title: "Avg Monthly Expense",
      value: formatCurrency(stats.avgMonthlyExpense),
      icon: Calculator,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="rounded-[32px] border-none shadow-sm bg-card p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.bg} ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider truncate">
                    {card.title}
                  </p>
                  <p className={`font-extrabold tracking-tight mt-0.5 text-foreground truncate ${"isText" in card && card.isText ? "text-sm" : "text-lg"}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income Trend */}
        <Card className="rounded-[32px] border-none shadow-sm bg-card p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-base font-extrabold text-foreground">Monthly Income Trend</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Income over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {incomeTrend.every((d) => d.amount === 0) ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No income data yet
              </div>
            ) : (
              <div style={{ width: "100%", height: 280, minWidth: 0, minHeight: 280 }}>
                {isMounted ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={incomeTrend}>
                      <defs>
                        <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                        formatter={(value: unknown) => formatIDR(Number(value))}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        name="Income"
                        stroke="#10b981"
                        fill="url(#incomeGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-muted/10 animate-pulse rounded-[24px]" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Trend */}
        <Card className="rounded-[32px] border-none shadow-sm bg-card p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-base font-extrabold text-foreground">Monthly Expense Trend</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Expenses over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {expenseTrend.every((d) => d.amount === 0) ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No expense data yet
              </div>
            ) : (
              <div style={{ width: "100%", height: 280, minWidth: 0, minHeight: 280 }}>
                {isMounted ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={expenseTrend}>
                      <defs>
                        <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                        formatter={(value: unknown) => formatIDR(Number(value))}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        name="Expense"
                        stroke="#f43f5e"
                        fill="url(#expenseGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-muted/10 animate-pulse rounded-[24px]" />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Distribution */}
        <Card className="rounded-[32px] border-none shadow-sm bg-card p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-base font-extrabold text-foreground">Expense Distribution</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Spending breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {expenseDistribution.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No expense data yet
              </div>
            ) : (
              <div style={{ width: "100%", height: 280, minWidth: 0, minHeight: 280 }}>
                {isMounted ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={expenseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        strokeWidth={0}
                      >
                        {expenseDistribution.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                        formatter={(value: unknown) => formatIDR(Number(value))}
                      />
                      <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "500", marginTop: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-muted/10 animate-pulse rounded-[24px]" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Progress */}
        <Card className="rounded-[32px] border-none shadow-sm bg-card p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-base font-extrabold text-foreground">Savings Progress</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Current vs Target amounts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {savingsProgress.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No savings goals yet
              </div>
            ) : (
              <div style={{ width: "100%", height: 280, minWidth: 0, minHeight: 280 }}>
                {isMounted ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={savingsProgress} layout="vertical" barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} stroke="rgba(0,0,0,0.04)" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#888888", fontWeight: 500 }} tickLine={false} axisLine={false} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                        formatter={(value: unknown) => formatIDR(Number(value))}
                      />
                      <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "500", marginTop: "12px" }} />
                      <Bar dataKey="current" name="Saved" fill="#10b981" radius={[0, 8, 8, 0]} />
                      <Bar dataKey="target" name="Target" fill="#6366f1" radius={[0, 8, 8, 0]} opacity={0.2} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-muted/10 animate-pulse rounded-[24px]" />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
