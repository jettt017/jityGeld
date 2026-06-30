import type { ExportTransaction, ExportOptions } from "@/lib/export";
import { computeSummary, formatCurrencyExport, generateFilename, getPeriodLabel } from "@/lib/export";

/**
 * Generate and download a PDF financial report using jsPDF + autotable.
 * Runs client-side only (imported dynamically).
 */
export async function exportToPDF(
  transactions: ExportTransaction[],
  options: ExportOptions
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  type RGB = [number, number, number];
  const BLUE: RGB = [29, 78, 216];
  const LIGHT_BLUE: RGB = [239, 246, 255];
  const GRAY: RGB = [107, 114, 128];
  const DARK: RGB = [17, 24, 39];
  const WHITE: RGB = [255, 255, 255];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;

  // ─── Header ─────────────────────────────────────────────────────
  // Blue banner
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, pageWidth, 36, "F");

  // Logo / App name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  doc.text("JityGeld", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 220, 255);
  doc.text("Financial Report", margin, 24);

  // Period and export date — right aligned
  const period = getPeriodLabel(options.range, options.customStartDate, options.customEndDate);
  const exportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.setFontSize(9);
  doc.setTextColor(200, 220, 255);
  doc.text(`Period: ${period}`, pageWidth - margin, 18, { align: "right" });
  doc.text(`Generated: ${exportDate}`, pageWidth - margin, 25, { align: "right" });

  let cursorY = 46;

  // ─── Summary Cards ───────────────────────────────────────────────
  if (options.includeSummary) {
    const summary = computeSummary(
      transactions,
      options.range,
      options.customStartDate,
      options.customEndDate
    );

    const cardW = (pageWidth - margin * 2 - 9) / 4;
    const cards: { label: string; value: string; color: [number, number, number] }[] = [
      { label: "Total Income", value: formatCurrencyExport(summary.totalIncome), color: [59, 130, 246] },
      { label: "Total Expense", value: formatCurrencyExport(summary.totalExpense), color: [239, 68, 68] },
      { label: "Balance", value: formatCurrencyExport(summary.balance), color: [16, 185, 129] },
      { label: "Transactions", value: String(summary.totalTransactions), color: [139, 92, 246] },
    ];

    cards.forEach((card, i) => {
      const x = margin + i * (cardW + 3);
      doc.setFillColor(...LIGHT_BLUE);
      doc.roundedRect(x, cursorY, cardW, 22, 2, 2, "F");

      doc.setFillColor(...card.color);
      doc.rect(x, cursorY, 3, 22, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...GRAY);
      doc.text(card.label.toUpperCase(), x + 5, cursorY + 8);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      const valLines = doc.splitTextToSize(card.value, cardW - 6);
      doc.text(valLines[0], x + 5, cursorY + 16);
    });

    cursorY += 30;
  }

  // ─── Transaction Table ────────────────────────────────────────────
  const headCols: string[] = [];
  if (options.includeDate) headCols.push("Date");
  if (options.includeCategory) headCols.push("Category");
  headCols.push("Type");
  headCols.push("Amount");
  if (options.includeNotes) headCols.push("Description");

  const rows = transactions.map((tx) => {
    const row: string[] = [];
    if (options.includeDate) row.push(tx.transactionDate);
    if (options.includeCategory) row.push(tx.categoryName);
    row.push(tx.type);
    row.push(formatCurrencyExport(tx.amount));
    if (options.includeNotes) row.push(tx.description || "—");
    return row;
  });

  autoTable(doc, {
    startY: cursorY,
    head: [headCols],
    body: rows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: DARK,
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: BLUE,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: LIGHT_BLUE,
    },
    didParseCell: (data) => {
      // Color income/expense type cell
      if (data.section === "body" && data.column.index === headCols.indexOf("Type")) {
        const val = data.cell.raw as string;
        data.cell.styles.textColor = val === "INCOME" ? [37, 99, 235] : [220, 38, 38];
        data.cell.styles.fontStyle = "bold";
      }
    },
    showHead: "everyPage",
  });

  // ─── Footer ─────────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(249, 250, 251);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text("Generated by JityGeld — Personal Finance Manager", margin, pageHeight - 4);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 4, { align: "right" });
  }

  // ─── Download ─────────────────────────────────────────────────
  const filename = generateFilename("pdf", options.range, options.customStartDate, options.customEndDate);
  doc.save(filename);
}
