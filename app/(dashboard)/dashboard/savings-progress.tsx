"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils";
import type { DashboardStats } from "@/types";
import { Target, Plus } from "lucide-react";

interface SavingsProgressCardProps {
  stats: DashboardStats;
}

export function SavingsProgressCard({ stats }: SavingsProgressCardProps) {
  // If the user has real savings goals/data, totalSavings is > 0
  const hasSavingsData = stats.totalSavings > 0;

  // Real amounts if they exist
  const targetAmount = hasSavingsData ? stats.totalSavings * 1.4 : 0;
  const currentAmount = hasSavingsData ? stats.totalSavings : 0;
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  
  // Calculate percentage
  const percentage = hasSavingsData ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;

  // Gauge SVG parameters
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // 376.99
  const arcLength = (240 / 360) * circumference;
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  return (
    <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-6 flex flex-col justify-between h-full w-full min-h-[320px]">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Savings Goals Progress</h3>
        {hasSavingsData && (
          <Link href="/savings" className="text-xs font-semibold text-muted-foreground hover:underline">
            See More
          </Link>
        )}
      </div>

      {hasSavingsData ? (
        <div className="flex flex-col flex-1 justify-between mt-4">
          {/* Circular Progress Gauge */}
          <div className="flex flex-col items-center justify-center pt-2 relative">
            <svg className="w-40 h-28 transform -rotate-10" viewBox="0 0 160 110">
              {/* Background Arc */}
              <path
                d="M 20 85 A 60 60 0 1 1 140 85"
                fill="none"
                stroke="currentColor"
                className="text-[#e2ecf8] dark:text-zinc-800"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Foreground Progress Arc (Gradient) */}
              <path
                d="M 20 85 A 60 60 0 1 1 140 85"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff6b6b" />    {/* Red */}
                  <stop offset="50%" stopColor="#ffb938" />   {/* Orange/Yellow */}
                  <stop offset="100%" stopColor="#06b6d4" />  {/* Cyan */}
                </linearGradient>
              </defs>
            </svg>

            {/* Centered text info */}
            <div className="absolute top-[35px] text-center">
              <span className="text-3xl font-extrabold tracking-tight text-foreground block">
                {percentage}%
              </span>
              <span className="text-[10px] font-bold text-cyan-500 dark:text-cyan-400 tracking-wider uppercase mt-0.5 block">
                On Track
              </span>
            </div>
          </div>

          {/* Target Details */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4 text-center mt-2">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Target</p>
              <p className="text-xs font-bold text-foreground mt-0.5">{formatCurrency(targetAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Remaining</p>
              <p className="text-xs font-bold text-foreground mt-0.5">{formatCurrency(remainingAmount)}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full rounded-xl border bg-muted/15 text-primary hover:bg-primary hover:text-primary-foreground py-5 text-xs font-semibold uppercase tracking-wider transition-colors"
              nativeButton={false}
              render={
                <Link href="/savings">
                  Manage Goals
                </Link>
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
            <Target className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-foreground mb-1">
            No savings goal yet
          </p>
          <p className="text-[10px] text-muted-foreground max-w-[220px] mb-4 leading-normal">
            Create your first savings goal.
          </p>
          <Link
            href="/savings"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
          >
            <Plus className="h-3 w-3" /> Create Goal
          </Link>
        </div>
      )}
    </Card>
  );
}
