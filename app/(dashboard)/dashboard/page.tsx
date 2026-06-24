import { getAuthUserId } from "@/actions/auth";
import {
  getDashboardStats,
  getMonthlyData,
  getRecentTransactions,
} from "@/services/dashboard";
import { createClient } from "@/lib/supabase/server";
import { TotalBalanceCard } from "./total-balance-card";
import { SpendingAnalyticsCard } from "./spending-analytics";
import { JityGeldInsightsCard } from "./jitygeld-insights";
import { RecentTransactionsList } from "./recent-transactions";
import { MainAnalyticsChart } from "./main-analytics-chart";
import { SavingsProgressCard } from "./savings-progress";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const userId = await getAuthUserId();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  const [stats, monthlyData, recentTransactions] = await Promise.all([
    getDashboardStats(userId),
    getMonthlyData(userId),
    getRecentTransactions(userId, 15),
  ]);

  return (
    <div className="space-y-4 pb-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Hello, {userName}!
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Here is your financial habit dashboard overview.
        </p>
      </div>

      {/* JityGeld Insights — compact banner */}
      <JityGeldInsightsCard />

      {/* Row 1: Total Balance | Spending Chart | Transactions — equal fixed-height columns */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 h-[320px]">
          <TotalBalanceCard stats={stats} userName={userName} />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-[320px]">
          <SpendingAnalyticsCard monthlyData={monthlyData} />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4 h-[320px]">
          <RecentTransactionsList transactions={recentTransactions} />
        </div>
      </div>

      {/* Row 2: Main Analytics Chart | Savings Progress — equal heights layout */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 lg:col-span-8 flex">
          <MainAnalyticsChart data={monthlyData} />
        </div>
        <div className="col-span-12 lg:col-span-4 flex">
          <SavingsProgressCard stats={stats} />
        </div>
      </div>
    </div>
  );
}
