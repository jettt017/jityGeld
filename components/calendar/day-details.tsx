"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Plus, X, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import { createTransaction } from "@/actions/transactions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CalendarDayData, CalendarTransaction } from "@/services/calendar";

interface Category {
  id: string;
  name: string;
  type: string;
}

interface DayDetailsProps {
  selectedDate: string | null; // YYYY-MM-DD
  dayData?: CalendarDayData;
  categories: Category[];
  filter: string;
  onClose: () => void;
  onTransactionCreated: () => void;
}

export function DayDetails({
  selectedDate,
  dayData,
  categories,
  filter,
  onClose,
  onTransactionCreated,
}: DayDetailsProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("EXPENSE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedDate) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[300px] rounded-2xl border border-border/40 bg-card/50 text-muted-foreground gap-2">
        <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 opacity-40" />
        </div>
        <span className="text-sm font-medium opacity-60">Select a date to view details</span>
      </div>
    );
  }

  const parsedDate = parseISO(selectedDate);
  const formattedDate = format(parsedDate, "EEEE, d MMMM yyyy");

  // Filter visible transactions based on active filter
  let visibleTxs: CalendarTransaction[] = dayData?.transactions ?? [];
  if (filter === "INCOME") visibleTxs = visibleTxs.filter((t) => t.type === "INCOME");
  else if (filter === "EXPENSE") visibleTxs = visibleTxs.filter((t) => t.type === "EXPENSE");
  else if (filter.startsWith("CAT:")) {
    const catId = filter.slice(4);
    visibleTxs = visibleTxs.filter((t) => t.categoryId === catId);
  }

  const filteredCategories = categories.filter(
    (c) => c.type === selectedType || c.type === "INCOME" || c.type === "EXPENSE"
  ).filter((c) => c.type === selectedType);

  async function handleAddSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await createTransaction(formData);
      if (!result.success) {
        setError(result.error || "Operation failed");
      } else {
        setShowForm(false);
        onTransactionCreated();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 border-b border-border/40">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
            Selected Date
          </p>
          <h3 className="text-base font-bold text-foreground leading-tight">{formattedDate}</h3>
          {dayData && (
            <div className="flex items-center gap-3 mt-1.5">
              {dayData.income > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(dayData.income)}
                </span>
              )}
              {dayData.expense > 0 && (
                <span className="text-xs font-bold text-rose-500">
                  -{formatCurrency(dayData.expense)}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 bg-muted/40 text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Transaction list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {visibleTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <div className="h-8 w-8 rounded-xl bg-muted/40 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 opacity-40" />
            </div>
            <span className="text-xs font-medium opacity-60">No transactions</span>
          </div>
        ) : (
          visibleTxs.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))
        )}
      </div>

      {/* Add transaction */}
      <div className="p-4 border-t border-border/40">
        {!showForm ? (
          <Button
            id="cal-add-tx"
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full h-9 rounded-xl text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Transaction
          </Button>
        ) : (
          <form
            key="add-form"
            action={handleAddSubmit}
            className="space-y-3"
          >
            {error && (
              <div className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive font-medium">
                {error}
              </div>
            )}

            {/* Hidden date */}
            <input type="hidden" name="transactionDate" value={selectedDate} />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                <select
                  name="type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-border/40 bg-muted/30 px-2.5 text-xs outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                <select
                  name="categoryId"
                  defaultValue=""
                  className="flex h-9 w-full rounded-lg border border-border/40 bg-muted/30 px-2.5 text-xs outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Select...</option>
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Amount</label>
              <Input name="amount" type="number" step="0.01" min="0" placeholder="0" required className="h-9 rounded-lg text-xs" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description</label>
              <Input name="description" type="text" placeholder="Optional" className="h-9 rounded-lg text-xs" />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => { setShowForm(false); setError(null); }}
                className="flex-1 h-9 rounded-xl text-xs font-semibold bg-muted/50 text-foreground hover:bg-muted border border-border/40 shadow-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-9 rounded-xl text-xs font-bold"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: CalendarTransaction }) {
  const isIncome = tx.type === "INCOME";
  const time = format(parseISO(tx.createdAt), "HH:mm");

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border/30 bg-background/60 p-2.5 transition-colors hover:bg-muted/30">
      {/* Type indicator */}
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          isIncome ? "bg-emerald-500/10" : "bg-rose-500/10"
        )}
      >
        {isIncome ? (
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs font-bold text-foreground truncate">{tx.categoryName}</span>
          <span
            className={cn(
              "shrink-0 text-xs font-bold",
              isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
            )}
          >
            {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
          </span>
        </div>
        {tx.description && (
          <p className="text-[11px] text-muted-foreground truncate">{tx.description}</p>
        )}
        <div className="flex items-center gap-1 mt-0.5">
          <Clock className="h-2.5 w-2.5 text-muted-foreground/60" />
          <span className="text-[10px] text-muted-foreground/60">{time}</span>
        </div>
      </div>
    </div>
  );
}
