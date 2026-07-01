"use client";

import { useState } from "react";
import { ChevronDown, FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { ExportDialog } from "./export-dialog";
import type { ExportFormat } from "@/lib/export";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              id="export-trigger"
              className="inline-flex items-center gap-1.5 h-9 rounded-[10px] border border-[color:var(--border-premium)] bg-card px-[14px] text-[14px] font-[500] text-foreground/80 shadow-[var(--shadow-premium)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-premium-hover)] hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 select-none"
            >
              Export
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          }
        />
        <DropdownMenuContent 
          align="end" 
          sideOffset={8}
          className="w-[190px] rounded-2xl border-[color:var(--border-premium)] shadow-xl animate-in fade-in zoom-in-95 duration-200 ease-out p-1.5"
        >
          {formatItems.map(({ format, label, icon }) => (
            <DropdownMenuItem
              key={format}
              onClick={() => handleFormatSelect(format)}
              className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-[13px] font-[500] text-foreground/80 transition-colors duration-150 focus:bg-primary/10 focus:text-primary cursor-pointer outline-none"
            >
              {icon}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        format={selectedFormat}
        categories={categories}
      />
    </>
  );
}
