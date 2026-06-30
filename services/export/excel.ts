import type { ExportTransaction, ExportOptions } from "@/lib/export";
import { computeSummary, formatCurrencyExport, generateFilename } from "@/lib/export";
import type ExcelJS from "exceljs";

/**
 * Generate and download an Excel .xlsx file using ExcelJS.
 * Runs client-side only (imported dynamically).
 */
export async function exportToExcel(
  transactions: ExportTransaction[],
  options: ExportOptions
): Promise<void> {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "JityGeld";
  workbook.created = new Date();

  // ─── Sheet 1: Transactions ─────────────────────────────────────
  const sheet1 = workbook.addWorksheet("Transactions");

  // Define columns
  const columns: Partial<ExcelJS.Column>[] = [
    { header: "Date", key: "date", width: 14 },
  ];
  if (options.includeCategory) {
    columns.push({ header: "Category", key: "category", width: 16 });
  }
  columns.push(
    { header: "Type", key: "type", width: 10 },
    { header: "Amount (IDR)", key: "amount", width: 18 },
  );
  if (options.includeNotes) {
    columns.push({ header: "Description", key: "description", width: 30 });
  }
  if (options.includeDate) {
    columns.push({ header: "Created At", key: "createdAt", width: 20 });
  }

  sheet1.columns = columns;

  // Style header row
  const headerRow = sheet1.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1D4ED8" }, // blue-700
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FF93C5FD" } },
    };
  });

  // Freeze first row
  sheet1.views = [{ state: "frozen", ySplit: 1 }];

  // Add data rows
  for (const tx of transactions) {
    const rowData: Record<string, unknown> = {
      date: tx.transactionDate,
    };
    if (options.includeCategory) rowData.category = tx.categoryName;
    rowData.type = tx.type;
    rowData.amount = tx.amount;
    if (options.includeNotes) rowData.description = tx.description || "";
    if (options.includeDate) rowData.createdAt = new Date(tx.createdAt).toLocaleString("en-US");

    const row = sheet1.addRow(rowData);

    // Color income rows
    if (tx.type === "INCOME") {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEFF6FF" }, // blue-50
        };
      });
    }

    // Format amount column as number with separator
    const amountColIndex = columns.findIndex((c) => c.key === "amount") + 1;
    if (amountColIndex > 0) {
      const amountCell = row.getCell(amountColIndex);
      amountCell.numFmt = '#,##0';
      amountCell.alignment = { horizontal: "right" };
    }
  }

  // Auto-fit column width based on content
  sheet1.columns.forEach((col) => {
    if (!col.key) return;
    let maxLen = (col.header as string)?.length ?? 10;
    sheet1.eachRow((row) => {
      const cellValue = row.getCell(col.key!).value;
      const len = cellValue ? String(cellValue).length : 0;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 4, 50);
  });

  // ─── Sheet 2: Financial Summary ────────────────────────────────
  if (options.includeSummary) {
    const summary = computeSummary(
      transactions,
      options.range,
      options.customStartDate,
      options.customEndDate
    );

    const sheet2 = workbook.addWorksheet("Financial Summary");

    const summaryHeaderStyle = {
      font: { bold: true, size: 12, color: { argb: "FF1E3A5F" } },
      fill: {
        type: "pattern" as const,
        pattern: "solid" as const,
        fgColor: { argb: "FFE0F2FE" },
      },
    };

    const summaryData: [string, string][] = [
      ["Period", summary.period],
      ["Export Date", summary.exportDate],
      ["", ""],
      ["Total Income", formatCurrencyExport(summary.totalIncome)],
      ["Total Expense", formatCurrencyExport(summary.totalExpense)],
      ["Current Balance", formatCurrencyExport(summary.balance)],
      ["", ""],
      ["Total Transactions", String(summary.totalTransactions)],
      ["Most Used Category", summary.mostUsedCategory],
      ["Largest Expense", formatCurrencyExport(summary.largestExpense)],
      ["Largest Income", formatCurrencyExport(summary.largestIncome)],
    ];

    sheet2.columns = [
      { header: "Metric", key: "metric", width: 24 },
      { header: "Value", key: "value", width: 28 },
    ];

    // Style summary sheet header row
    const s2Header = sheet2.getRow(1);
    s2Header.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1D4ED8" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    for (const [metric, value] of summaryData) {
      sheet2.addRow({ metric, value });
    }
  }

  // ─── Download ─────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadBlob(
    blob,
    generateFilename("excel", options.range, options.customStartDate, options.customEndDate)
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
