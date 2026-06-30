"use client";

import { useState } from "react";
import { ChevronDown, FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { ExportDialog } from "./export-dialog";
import type { ExportFormat } from "@/lib/export";

interface Category {
  id: string;
  name: string;
  type: string;
}

interface ExportButtonProps {
  categories: Category[];
}

const formatItems: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
  {
    format: "excel",
    label: "Export as Excel (.xlsx)",
    icon: <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />,
  },
  {
    format: "pdf",
    label: "Export as PDF (.pdf)",
    icon: <FileText className="h-3.5 w-3.5 text-rose-500" />,
  },
  {
    format: "csv",
    label: "Export as CSV (.csv)",
    icon: <FileDown className="h-3.5 w-3.5 text-blue-500" />,
  },
];

export function ExportButton({ categories }: ExportButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("excel");

  function handleFormatSelect(format: ExportFormat) {
    setSelectedFormat(format);
    setMenuOpen(false);
    setDialogOpen(true);
  }

  return (
    <>
      {/* Trigger + dropdown wrapper */}
      <div className="relative">
        <button
          type="button"
          id="export-trigger"
          onClick={() => setMenuOpen((prev) => !prev)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="inline-flex items-center gap-1.5 h-9 rounded-[10px] border border-border/50 bg-card px-[14px] text-[14px] font-[500] text-foreground/80 shadow-sm transition-all duration-150 hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 select-none"
        >
          Export
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {menuOpen && (
          <div
            id="export-dropdown"
            className="absolute right-0 z-50 mt-1.5 w-[190px] overflow-hidden rounded-xl border border-border/50 bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 duration-100"
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              {formatItems.map(({ format, label, icon }) => (
                <button
                  key={format}
                  type="button"
                  onMouseDown={() => handleFormatSelect(format)}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left text-[13px] font-[500] text-foreground/80 transition-colors duration-150 hover:bg-primary/8 hover:text-foreground focus:outline-none"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        format={selectedFormat}
        categories={categories}
      />
    </>
  );
}
