"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchExportTransactions } from "@/actions/export";
import { exportToExcel } from "@/services/export/excel";
import { exportToPDF } from "@/services/export/pdf";
import { exportToCSV } from "@/services/export/csv";
import type { ExportFormat, ExportOptions, ExportRange } from "@/lib/export";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  type: string;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: ExportFormat;
  categories: Category[];
}

type ExportState = "idle" | "loading" | "success" | "error";

export function ExportDialog({
  open,
  onOpenChange,
  format,
  categories,
}: ExportDialogProps) {
  const [range, setRange] = useState<ExportRange>("monthly");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [type, setType] = useState<"" | "INCOME" | "EXPENSE">("");
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeCategory, setIncludeCategory] = useState(true);
  const [includeDate, setIncludeDate] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  const [state, setState] = useState<ExportState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const formatLabels: Record<ExportFormat, string> = {
    excel: "Excel (.xlsx)",
    pdf: "PDF (.pdf)",
    csv: "CSV (.csv)",
  };

  async function handleExport() {
    setState("loading");
    setErrorMsg("");

    try {
      const options: ExportOptions = {
        format,
        range,
        customStartDate: range === "custom" ? customStart : undefined,
        customEndDate: range === "custom" ? customEnd : undefined,
        categoryId: categoryId || undefined,
        type: type || undefined,
        includeNotes,
        includeCategory,
        includeDate,
        includeSummary,
      };

      const result = await fetchExportTransactions(options);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (format === "excel") {
        await exportToExcel(result.data, options);
      } else if (format === "pdf") {
        await exportToPDF(result.data, options);
      } else {
        exportToCSV(result.data, options);
      }

      setState("success");
      setTimeout(() => {
        setState("idle");
        onOpenChange(false);
      }, 1800);
    } catch (err) {
      console.error("Export failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "Unable to generate the file. Please try again.");
      setState("error");
    }
  }

  function handleClose() {
    if (state === "loading") return;
    setState("idle");
    setErrorMsg("");
    onOpenChange(false);
  }

  const isLoading = state === "loading";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Export Transactions</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose the data you want to export as{" "}
            <span className="font-semibold text-foreground">{formatLabels[format]}</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-semibold text-foreground">Preparing your export...</p>
            <p className="text-xs text-muted-foreground">Generating file, please wait...</p>
          </div>
        )}

        {/* Success state */}
        {state === "success" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <p className="text-sm font-semibold text-foreground">Export completed successfully.</p>
            <p className="text-xs text-muted-foreground">Your file is downloading...</p>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <XCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm font-semibold text-destructive">Unable to generate the file.</p>
            <p className="text-xs text-muted-foreground text-center">{errorMsg}</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl mt-1"
              onClick={() => setState("idle")}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Form */}
        {state === "idle" && (
          <div className="space-y-5 py-1">
            {/* Export Range */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Export Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["weekly", "monthly", "yearly", "custom"] as ExportRange[]).map((r) => (
                  <label
                    key={r}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer text-xs font-medium transition-all",
                      range === r
                        ? "border-primary bg-primary/8 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <input
                      type="radio"
                      name="range"
                      value={r}
                      checked={range === r}
                      onChange={() => setRange(r)}
                      className="accent-primary h-3 w-3"
                    />
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                    {r === "custom" ? " Range" : ""}
                  </label>
                ))}
              </div>
              {range === "custom" && (
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold">From</label>
                    <Input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="h-8 text-xs rounded-lg border-border/40 bg-slate-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold">To</label>
                    <Input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="h-8 text-xs rounded-lg border-border/40 bg-slate-50 dark:bg-zinc-900/50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-9 w-full rounded-xl border border-border/40 bg-slate-50 dark:bg-zinc-900/50 px-3 text-xs font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Transaction Type
              </label>
              <div className="flex gap-2">
                {([["", "All"], ["INCOME", "Income"], ["EXPENSE", "Expense"]] as const).map(
                  ([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setType(val)}
                      className={cn(
                        "flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
                        type === val
                          ? "border-primary bg-primary/8 text-primary"
                          : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Include Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Include
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "includeNotes", label: "Notes", value: includeNotes, set: setIncludeNotes },
                  { key: "includeCategory", label: "Category", value: includeCategory, set: setIncludeCategory },
                  { key: "includeDate", label: "Transaction Date", value: includeDate, set: setIncludeDate },
                  {
                    key: "includeSummary",
                    label: format === "csv" ? "Summary (appended)" : "Summary Page",
                    value: includeSummary,
                    set: setIncludeSummary,
                  },
                ].map(({ key, label, value, set }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => set(e.target.checked)}
                      className="accent-primary h-3.5 w-3.5 rounded"
                    />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {state === "idle" && (
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-xl px-5 text-xs font-semibold"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="rounded-xl px-6 text-xs font-bold"
              disabled={isLoading || (range === "custom" && (!customStart || !customEnd))}
            >
              Export
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
