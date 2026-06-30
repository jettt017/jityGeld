"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ============================================================================
   1. DASHBOARD SKELETON
   ============================================================================ */
export function DashboardSkeleton() {
  return (
    <div className="space-y-4 pb-8" aria-busy="true">
      {/* Greeting Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>

      {/* Insights Banner Skeleton */}
      <Card className="rounded-2xl border border-blue-500/5 shadow-sm bg-card p-4 sm:p-5 h-[180px] flex flex-col gap-3 justify-between overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-4 w-60 rounded-lg hidden sm:block" />
          </div>
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 mt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl bg-muted/10 border p-3.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-xl" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-5/6 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>

      {/* Row 1: Total Balance Card, Spending, Recent Transactions */}
      <div className="grid grid-cols-12 gap-4">
        {/* Total Balance Card */}
        <div className="col-span-12 lg:col-span-4 h-[320px]">
          <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-5 flex flex-col gap-3 h-full justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-lg" />
              <Skeleton className="h-8 w-44 rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-9 rounded-lg" />
              <Skeleton className="flex-1 h-9 rounded-lg" />
            </div>
            <div className="h-px bg-border/40" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-10 rounded-lg" />
                  </div>
                  <Skeleton className="h-4.5 w-16 rounded-lg" />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-3 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </Card>
        </div>

        {/* Spending Card */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-[320px]">
          <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-5 flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-6.5 w-16 rounded-lg" />
            </div>
            <div className="space-y-2 flex-1 flex flex-col justify-end">
              <div className="flex items-end justify-between gap-3 px-2 h-36">
                {[40, 75, 60, 90, 50, 85].map((h, i) => (
                  <Skeleton
                    key={i}
                    className="w-full rounded-t-lg"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between gap-3 text-center px-1 pt-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                  <Skeleton key={m} className="h-3.5 w-8 rounded-md" />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions List */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-[320px]">
          <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-5 flex flex-col gap-3 h-full justify-between">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4.5 w-24 rounded-lg" />
              <Skeleton className="h-3.5 w-12 rounded-lg" />
            </div>
            <div className="flex-1 overflow-hidden space-y-3 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-28 rounded-lg" />
                      <Skeleton className="h-3 w-16 rounded-lg" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 2: Main Area Chart & Savings Progress */}
      <div className="grid grid-cols-12 gap-4">
        {/* Main Analytics Chart */}
        <div className="col-span-12 lg:col-span-8 h-[340px]">
          <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-7 w-28 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
            <div className="flex-1 flex flex-col justify-end space-y-3">
              <div className="h-40 w-full relative flex items-end">
                {/* Horizontal lines to mimic grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b w-full" />
                  <div className="border-b w-full" />
                  <div className="border-b w-full" />
                  <div className="border-b w-full" />
                </div>
                {/* Visual mockup of shimmering area chart */}
                <svg className="w-full h-full text-muted/30" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,80 Q20,30 40,60 T80,45 T100,50 L100,100 L0,100 Z" fill="currentColor" />
                </svg>
              </div>
              <div className="flex justify-between text-center pt-2">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                  <Skeleton key={m} className="h-3.5 w-10 rounded-md" />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Savings Progress Card */}
        <div className="col-span-12 lg:col-span-4 h-[340px]">
          <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-6 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-48 rounded-lg" />
              <Skeleton className="h-4 w-12 rounded-lg" />
            </div>
            <div className="flex flex-col items-center justify-center py-4 relative">
              {/* Fake semi-circle progress arc */}
              <div className="w-32 h-16 border-t-8 border-l-8 border-r-8 border-muted/30 rounded-t-full flex items-end justify-center relative">
                <div className="absolute bottom-0 text-center">
                  <Skeleton className="h-6 w-12 mx-auto rounded-lg" />
                  <Skeleton className="h-3.5 w-16 mx-auto mt-1 rounded-lg" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-center">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-16 mx-auto rounded-md" />
                <Skeleton className="h-4.5 w-24 mx-auto rounded-md" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-16 mx-auto rounded-md" />
                <Skeleton className="h-4.5 w-24 mx-auto rounded-md" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. TRANSACTIONS SKELETON
   ============================================================================ */
export function TransactionsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4.5 w-72 rounded-lg" />
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-5.5 w-32 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Area Card */}
      <Card className="rounded-2xl border-none shadow-sm bg-card p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </Card>

      {/* Transactions Table Card */}
      <Card className="rounded-2xl border-none shadow-sm bg-card p-5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-16 rounded-md" /></TableHead>
              <TableHead><Skeleton className="h-4 w-28 rounded-md" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20 rounded-md" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12 rounded-md" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto rounded-md" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto rounded-md" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4.5 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12 rounded-md" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto rounded-md" /></TableCell>
                <TableCell className="text-right flex justify-end gap-1.5"><Skeleton className="h-7 w-7 rounded-lg" /><Skeleton className="h-7 w-7 rounded-lg" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Fake Table Footer pagination */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t">
          <Skeleton className="h-4 w-24 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================================
   3. ANALYTICS SKELETON
   ============================================================================ */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      {/* Metrics Stat Cards (5 Column Grid) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-4.5 w-24 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Row 1 Charts (Monthly Income and Monthly Expense Trend) */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-6">
            <div className="space-y-1 mb-6">
              <Skeleton className="h-5 w-40 rounded-lg" />
              <Skeleton className="h-3.5 w-56 rounded-md" />
            </div>
            <div className="h-[280px] w-full flex flex-col justify-end gap-3">
              <div className="h-56 w-full border-b border-l flex items-end justify-between px-4 pb-2">
                <svg className="w-full h-full text-muted/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,70 L20,50 L40,80 L60,30 L80,60 L100,40" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between px-3">
                {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                  <Skeleton key={m} className="h-3 w-8 rounded-md" />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Row 2 Charts (Expense distribution and Savings Progress) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expense Distribution */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-6">
          <div className="space-y-1 mb-6">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-60 rounded-md" />
          </div>
          <div className="h-[280px] flex items-center justify-center gap-8">
            {/* Fake Pie chart circle */}
            <div className="h-44 w-44 rounded-full border-8 border-muted/30 border-t-primary/20 flex items-center justify-center" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Savings Progress */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-6">
          <div className="space-y-1 mb-6">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-60 rounded-md" />
          </div>
          <div className="h-[280px] flex flex-col justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <Skeleton className="h-3 w-24 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <Skeleton className="h-3.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================================
   4. SAVINGS SKELETON
   ============================================================================ */
export function SavingsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      {/* Title block */}
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-4.5 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-5.5 w-32 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Goal Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-6 flex flex-col justify-between h-[230px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3.5 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4.5 w-24 rounded-md" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4.5 w-24 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   5. CATEGORIES SKELETON
   ============================================================================ */
export function CategoriesSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      {/* Header and buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4.5 w-72 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Categories list grid (Takes 2/3 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3.5 w-20 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-7 w-7 rounded-lg" />
                  <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Summary Card (Takes 1/3 col) */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-28 rounded-lg" />
          <Card className="rounded-2xl border-none shadow-sm bg-card p-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 pt-1">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-28 rounded-md" />
                  <Skeleton className="h-4.5 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   6. SETTINGS SKELETON
   ============================================================================ */
export function SettingsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Skeleton className="h-4.5 w-60 rounded-lg" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Avatar Card */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-6 flex flex-col items-center text-center justify-center space-y-4 h-[250px]">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 w-full px-4">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-3.5 w-2/3 mx-auto rounded-md" />
          </div>
        </Card>

        {/* Right Side: Fields Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form Card */}
          <Card className="rounded-2xl border-none shadow-sm bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4.5 w-16 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4.5 w-16 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </Card>

          {/* Preferences Card */}
          <Card className="rounded-2xl border-none shadow-sm bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-3 w-40 rounded-md" />
                  </div>
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   7. CALENDAR SKELETON
   ============================================================================ */
export function CalendarSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      {/* Title block */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-4.5 w-64 rounded-lg" />
      </div>

      <div className="flex flex-col gap-5">
        {/* Summary Cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-none shadow-sm bg-card p-4 flex flex-col justify-between" style={{ height: "100px" }}>
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-24 rounded-lg mt-2" />
            </Card>
          ))}
        </div>

        {/* Header (Nav + filter) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-32 rounded-lg mx-2" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex gap-4">
          {/* Grid */}
          <div className="flex-1 min-w-0">
            <Card className="rounded-2xl border border-border/50 shadow-sm bg-card p-3 sm:p-4">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-8 mx-auto rounded-sm mb-1" />
                ))}
              </div>
              {/* Grid cells */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-[14px]" />
                ))}
              </div>
            </Card>
          </div>

          {/* Desktop side panel */}
          <div className="hidden lg:block w-72 xl:w-80 shrink-0">
            <Card className="rounded-2xl border border-border/50 shadow-sm bg-card h-full min-h-[500px] flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border/40">
                <Skeleton className="h-3 w-20 rounded-md mb-2" />
                <Skeleton className="h-5 w-32 rounded-lg" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-3 w-12 rounded-md" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              </div>
              {/* Transaction list */}
              <div className="p-4 space-y-3 flex-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-2.5">
                    <Skeleton className="h-7 w-7 rounded-lg shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-3 w-20 rounded-md" />
                        <Skeleton className="h-3 w-12 rounded-md" />
                      </div>
                      <Skeleton className="h-2 w-24 rounded-sm" />
                      <div className="flex items-center gap-1 mt-1">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-2 w-8 rounded-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add transaction button placeholder */}
              <div className="p-4 border-t border-border/40 mt-auto">
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
