"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const cards = [
  {
    key: "totalBalance" as const,
    title: "Total Balance",
    icon: DollarSign,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "totalIncome" as const,
    title: "Total Income",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    key: "totalExpense" as const,
    title: "Total Expense",
    icon: TrendingDown,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    key: "totalSavings" as const,
    title: "Total Savings",
    icon: PiggyBank,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {formatCurrency(stats[card.key])}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
