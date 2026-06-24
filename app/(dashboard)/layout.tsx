import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { TopNav } from "@/components/top-nav";
import { Wallet, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">JityGeld</span>
          </Link>
          <div className="hidden lg:block">
            <TopNav />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/transactions?add=true"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm font-bold uppercase tracking-wider text-[11px] h-9 px-3 sm:px-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </Link>
          <ThemeToggle />
          <UserNav
            email={user.email || ""}
            name={user.user_metadata?.name || user.email || ""}
            avatarUrl={user.user_metadata?.avatar_url || ""}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
