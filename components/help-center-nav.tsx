"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { GlobalLoading } from "@/components/global-loading";
import { cn } from "@/lib/utils";

const pages = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Support", href: "/support" },
];

interface HelpCenterNavProps {
  current: "/privacy" | "/terms" | "/support";
}

export function HelpCenterNav({ current }: HelpCenterNavProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentIndex = pages.findIndex((p) => p.href === current);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  function navigate(href: string) {
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <>
      <div className="flex justify-center mt-12 mb-8">
        <div className="inline-flex items-center gap-6 rounded-2xl border border-[color:var(--border-premium)] bg-card px-4 py-3 shadow-sm">
          {/* Previous Arrow */}
          <button
            type="button"
            aria-label="Previous page"
            disabled={!prevPage}
            onClick={() => prevPage && navigate(prevPage.href)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
              prevPage
                ? "bg-muted/50 hover:bg-muted text-foreground hover:-translate-x-0.5 active:scale-90"
                : "bg-muted/20 text-muted-foreground/40 cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Indicator */}
          <div className="flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {currentIndex + 1} / {pages.length}
            </span>
            <span className="text-sm font-semibold text-primary mt-1">
              {pages[currentIndex].label}
            </span>
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            aria-label="Next page"
            disabled={!nextPage}
            onClick={() => nextPage && navigate(nextPage.href)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
              nextPage
                ? "bg-muted/50 hover:bg-muted text-foreground hover:translate-x-0.5 active:scale-90"
                : "bg-muted/20 text-muted-foreground/40 cursor-not-allowed opacity-40"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isPending && (
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-200">
          <GlobalLoading />
        </div>
      )}
    </>
  );
}
