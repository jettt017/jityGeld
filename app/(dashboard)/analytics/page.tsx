import { getAuthUserId } from "@/actions/auth";
import {
  getMonthlyIncomeTrend,
  getMonthlyExpenseTrend,
  getExpenseDistribution,
  getSavingsProgress,
  getAnalyticsStats,
} from "@/services/analytics";
import { AnalyticsClient } from "./analytics-client";

export const metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const userId = await getAuthUserId();

  const [
    incomeTrend,
    expenseTrend,
    expenseDistribution,
    savingsProgress,
    stats,
  ] = await Promise.all([
    getMonthlyIncomeTrend(userId),
    getMonthlyExpenseTrend(userId),
    getExpenseDistribution(userId),
    getSavingsProgress(userId),
    getAnalyticsStats(userId),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Deep insights into your financial health
        </p>
      </div>
      <AnalyticsClient
        incomeTrend={incomeTrend}
        expenseTrend={expenseTrend}
        expenseDistribution={expenseDistribution}
        savingsProgress={savingsProgress}
        stats={stats}
      />
    </div>
  );
}
