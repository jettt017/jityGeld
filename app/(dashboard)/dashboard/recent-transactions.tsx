import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  ShoppingBag,
  Utensils,
  Award,
  Landmark,
  CreditCard,
  Bus,
  HeartPulse,
  Gamepad2,
  Plus,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils";

interface Transaction {
  id: string;
  amount: unknown;
  type: string;
  description: string | null;
  transactionDate: Date;
  category: { name: string; type: string };
}

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

function getCategoryIcon(categoryName: string, type: string) {
  const name = categoryName.toLowerCase();
  if (name.includes("food") || name.includes("eat") || name.includes("restaurant"))
    return <Utensils className="h-3.5 w-3.5" />;
  if (name.includes("shop") || name.includes("clothes") || name.includes("fashion"))
    return <ShoppingBag className="h-3.5 w-3.5" />;
  if (name.includes("salary") || name.includes("bonus") || name.includes("income"))
    return <Award className="h-3.5 w-3.5" />;
  if (name.includes("invest") || name.includes("bank") || name.includes("saving"))
    return <Landmark className="h-3.5 w-3.5" />;
  if (name.includes("card") || name.includes("credit"))
    return <CreditCard className="h-3.5 w-3.5" />;
  if (name.includes("transport") || name.includes("travel") || name.includes("bus"))
    return <Bus className="h-3.5 w-3.5" />;
  if (name.includes("health") || name.includes("medical") || name.includes("hospital"))
    return <HeartPulse className="h-3.5 w-3.5" />;
  if (name.includes("entertain") || name.includes("game") || name.includes("hobby"))
    return <Gamepad2 className="h-3.5 w-3.5" />;
  if (type === "INCOME") return <Award className="h-3.5 w-3.5" />;
  return <Wallet className="h-3.5 w-3.5" />;
}

export function RecentTransactionsList({
  transactions,
}: RecentTransactionsListProps) {
  const hasTransactions = transactions.length > 0;

  return (
    <Card className="rounded-2xl border-none shadow-sm bg-card p-4 sm:p-5 flex flex-col gap-3 h-full w-full">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Transactions</h3>
        {hasTransactions && (
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            See All <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* List / Empty State */}
      {hasTransactions ? (
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    tx.type === "INCOME"
                      ? "bg-blue-500/12 text-blue-600 dark:text-blue-400"
                      : "bg-muted/60 text-foreground/55"
                  }`}
                >
                  {getCategoryIcon(tx.category.name, tx.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground truncate max-w-[100px] sm:max-w-[130px] leading-none">
                    {tx.description || tx.category.name}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                    {formatDate(tx.transactionDate)}
                  </p>
                </div>
              </div>
              <span
                className={`text-[11px] font-extrabold tracking-tight shrink-0 ${
                  tx.type === "INCOME" ? "text-blue-500" : "text-foreground"
                }`}
              >
                {tx.type === "INCOME" ? "+" : "−"}
                {formatCurrency(Number(tx.amount))}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold text-foreground mb-1">
            No transactions yet
          </p>
          <p className="text-[10px] text-muted-foreground max-w-[200px] mb-4 leading-normal">
            Start tracking your income and expenses to see them here.
          </p>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
          >
            <Plus className="h-3 w-3" /> Add Transaction
          </Link>
        </div>
      )}
    </Card>
  );
}
