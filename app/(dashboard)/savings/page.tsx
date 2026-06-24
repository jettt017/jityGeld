import { getAuthUserId } from "@/actions/auth";
import { getSavingsGoals } from "@/services/savings";
import { SavingsClient } from "./savings-client";

export const metadata = {
  title: "Savings Goals",
};

export default async function SavingsPage() {
  const userId = await getAuthUserId();
  const goals = await getSavingsGoals(userId);

  const serialized = goals.map((g) => ({
    id: g.id,
    title: g.title,
    targetAmount: Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
    deadline: g.deadline ? g.deadline.toISOString().split("T")[0] : null,
    createdAt: g.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Savings Goals</h1>
        <p className="text-muted-foreground">
          Set targets and track your saving progress
        </p>
      </div>
      <SavingsClient goals={serialized} />
    </div>
  );
}
