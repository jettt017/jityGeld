import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Menu } from "lucide-react";
import { DashboardSkeleton } from "@/components/skeletons";
import { Footer } from "@/components/footer";

export function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background z-50 animate-in fade-in duration-200">
      {/* Mock Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground">
            <Menu className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">JityGeld</span>
          </div>

          {/* Desktop Nav Skeleton */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="hidden md:block h-9 w-36 rounded-lg" />
          <Skeleton className="hidden md:block h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
        <DashboardSkeleton />
      </main>

      <Footer />
    </div>
  );
}
