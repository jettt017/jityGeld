import { getAuthUserId } from "@/actions/auth";
import { getCategories } from "@/services/categories";
import { CategoriesClient } from "./categories-client";

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const userId = await getAuthUserId();
  const categories = await getCategories(userId);

  const serialized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    transactionCount: c._count.transactions,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Manage your income and expense categories
        </p>
      </div>
      <CategoriesClient categories={serialized} />
    </div>
  );
}
