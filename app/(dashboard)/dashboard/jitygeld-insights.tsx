"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lightbulb, Target, TrendingUp } from "lucide-react";

const insights = [
  {
    icon: Lightbulb,
    iconBg: "bg-amber-400/20 text-amber-600",
    label: "Weekly Saving Tip",
    body: "Reduce dining out by 10% this week to save Rp150.000 — that's Rp600.000 per month.",
  },
  {
    icon: Target,
    iconBg: "bg-cyan-500/20 text-cyan-700",
    label: "Goal Update",
    body: "\"Emergency Fund\" is 72% complete. You need Rp200.000 more to hit your target.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-blue-400/20 text-blue-700",
    label: "Spending Trend",
    body: "Food & Shopping make up 62% of monthly spending. Review your budget allocation.",
  },
];

export function JityGeldInsightsCard() {
  return (
    <Card
      className="bg-[#dbeafe] dark:bg-card p-5 relative overflow-hidden"
      style={{ minHeight: 180 }}
    >
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-64 opacity-[0.12] dark:opacity-[0.015]">
        <svg viewBox="0 0 200 200" className="h-full w-full text-blue-900 dark:text-blue-400">
          <circle cx="160" cy="40"  r="70" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="190" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="140" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-800/12 dark:bg-transparent dark:border dark:border-blue-500/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-800 dark:text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              JityGeld Insights
            </span>
            <span className="hidden sm:block text-[13px] font-bold text-blue-950 dark:text-blue-100">
              How to Manage your Wealth Smartly?
            </span>
          </div>
          <Link
            href="/analytics"
            className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-800 dark:bg-primary hover:bg-blue-900 dark:hover:bg-[#1D4ED8] px-3 py-1 text-[10px] font-bold text-white transition-colors duration-200"
          >
            Explore <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>

        {/* 3 insight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1">
          {insights.map(({ icon: Icon, iconBg, label, body }) => (
            <div
              key={label}
              className="flex flex-col gap-2 rounded-xl bg-white/55 dark:bg-muted border border-blue-900/[0.06] dark:border-border p-3.5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-[11px] font-extrabold text-blue-950 dark:text-blue-200 leading-tight">
                  {label}
                </p>
              </div>
              <p className="text-[10px] font-medium text-blue-900/65 dark:text-blue-400/80 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
