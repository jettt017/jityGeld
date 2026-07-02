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
      <div className="flex justify-start mb-10">
        <div className="inline-flex items-center gap-1 rounded-2xl border border-[color:var(--border-premium)] bg-card px-2 py-1.5 shadow-sm max-w-[460px]">
          {/* Previous Arrow */}
          <button
            type="button"
            aria-label="Previous page"
            disabled={!prevPage}
            onClick={() => prevPage && navigate(prevPage.href)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
              prevPage
                ? "hover:bg-muted text-foreground hover:-translate-x-0.5 active:scale-90"
                : "text-muted-foreground/40 cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Indicator */}
          <div className="flex items-center gap-2.5 px-2">
            {pages.map((page, i) => (
              <button
                key={page.href}
                type="button"
                onClick={() => page.href !== current && navigate(page.href)}
                aria-label={`Go to ${page.label}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all duration-200",
                  page.href === current
                    ? "bg-primary/10 text-primary font-semibold cursor-default"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                )}
              >
                <span className="text-[10px] font-bold text-current/50">{i + 1}</span>
                <span className="hidden sm:block">{page.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            aria-label="Next page"
            disabled={!nextPage}
            onClick={() => nextPage && navigate(nextPage.href)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
              nextPage
                ? "hover:bg-muted text-foreground hover:translate-x-0.5 active:scale-90"
                : "text-muted-foreground/40 cursor-not-allowed opacity-40"
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
