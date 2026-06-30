import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Footer } from "@/components/footer";
import { Plus } from "lucide-react";
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
      <DashboardHeader
        user={{
          email: user.email || "",
          name: user.user_metadata?.name || user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || "",
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <Footer />

      {/* Floating Action Button (FAB) on Mobile */}
      <Link
        href="/transactions?add=true"
        className="fixed bottom-6 right-6 z-40 md:hidden flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
