"use client";

import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils";
import type { DashboardStats } from "@/types";

interface TotalBalanceCardProps {
  stats: DashboardStats;
  userName: string;
}

export function TotalBalanceCard({ stats }: TotalBalanceCardProps) {
  const savingsRate =
    stats.totalIncome > 0
      ? Math.max(
          0,
          Math.round(
            ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100
          )
        )
      : 0;

  return (
    <Card className="rounded-[32px] border-none shadow-sm bg-card p-5 flex flex-col gap-3 h-full w-full">
      {/* Label + Balance */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Total Balance
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground leading-none">
          {formatCurrency(stats.totalBalance)}
        </h2>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-full border bg-muted/30 hover:bg-muted/60 text-foreground py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
            <ArrowUpRight className="h-2.5 w-2.5" />
          </div>
          Send
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 rounded-full border bg-muted/30 hover:bg-muted/60 text-foreground py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
            <ArrowDownLeft className="h-2.5 w-2.5" />
          </div>
          Receive
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Income / Expense / Savings Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              Income
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-foreground leading-none">
            {formatCurrency(stats.totalIncome)}
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              Expense
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-foreground leading-none">
            {formatCurrency(stats.totalExpense)}
          </p>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              Savings
            </span>
          </div>
          <p className="text-[11px] font-extrabold text-foreground leading-none">
            {savingsRate}%
          </p>
        </div>
      </div>

      {/* Savings Rate Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground">
              Savings Rate
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-foreground">
            {savingsRate}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
            style={{ width: `${Math.min(savingsRate, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
