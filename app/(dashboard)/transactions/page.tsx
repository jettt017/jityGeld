import { getAuthUserId } from "@/actions/auth";
import { getTransactions } from "@/services/transactions";
import { getCategories } from "@/services/categories";
import { TransactionsClient } from "./transactions-client";

export const metadata = {
  title: "Transactions",
};

interface SearchParams {
  page?: string;
  search?: string;
  type?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userId = await getAuthUserId();
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const search = params.search || undefined;
  const type = (params.type as "INCOME" | "EXPENSE") || undefined;
  const categoryId = params.categoryId || undefined;
  const startDate = params.startDate || undefined;
  const endDate = params.endDate || undefined;

  const [result, categories] = await Promise.all([
    getTransactions({ userId, page, search, type, categoryId, startDate, endDate }),
    getCategories(userId),
  ]);

  const serializedTransactions = result.transactions.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    type: t.type,
    description: t.description,
    transactionDate: t.transactionDate.toISOString().split("T")[0],
    categoryId: t.categoryId,
    categoryName: t.category.name,
    categoryType: t.category.type,
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your income and expenses
        </p>
      </div>
      <TransactionsClient
        transactions={serializedTransactions}
        categories={serializedCategories}
        totalPages={result.totalPages}
        currentPage={result.currentPage}
        total={result.total}
        totalIncome={result.totalIncome}
        totalExpense={result.totalExpense}
        filters={{ search, type, categoryId, startDate, endDate }}
      />
    </div>
  );
}
