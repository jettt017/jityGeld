import type { ExportTransaction, ExportOptions, ExportSummary } from "@/lib/export";
import { computeSummary, formatCurrencyExport, generateFilename } from "@/lib/export";

/**
 * Generate and download a CSV file from the given transactions.
 */
export function exportToCSV(
  transactions: ExportTransaction[],
  options: ExportOptions
): void {
  const rows: string[][] = [];

  // Header row
  const headers: string[] = ["Date"];
  if (options.includeCategory) headers.push("Category");
  headers.push("Type");
  headers.push("Amount");
  if (options.includeNotes) headers.push("Description");
  headers.push("Created At");

  rows.push(headers);

  // Data rows
  for (const tx of transactions) {
    const row: string[] = [tx.transactionDate];
    if (options.includeCategory) row.push(tx.categoryName);
    row.push(tx.type);
    row.push(String(tx.amount));
    if (options.includeNotes) row.push(tx.description || "");
    row.push(tx.createdAt);
    rows.push(row);
  }

  // Add summary if requested
  if (options.includeSummary) {
    const summary = computeSummary(
      transactions,
      options.range,
      options.customStartDate,
      options.customEndDate
    );
    rows.push([]);
    rows.push(["--- SUMMARY ---"]);
    rows.push(["Period", summary.period]);
    rows.push(["Total Income", String(summary.totalIncome)]);
    rows.push(["Total Expense", String(summary.totalExpense)]);
    rows.push(["Balance", String(summary.balance)]);
    rows.push(["Total Transactions", String(summary.totalTransactions)]);
    rows.push(["Most Used Category", summary.mostUsedCategory]);
    rows.push(["Export Date", summary.exportDate]);
  }

  // Escape cells and join
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    )
    .join("\r\n");

  // UTF-8 BOM for Excel compatibility
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  downloadBlob(
    blob,
    generateFilename("csv", options.range, options.customStartDate, options.customEndDate)
  );
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
