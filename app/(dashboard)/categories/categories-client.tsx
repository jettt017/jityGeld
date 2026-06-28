"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag, ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

interface Category {
  id: string;
  name: string;
  type: string;
  transactionCount: number;
  createdAt: string;
}

interface CategoriesClientProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const incomeCategories = categories.filter((c) => c.type === "INCOME");
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, formData)
        : await createCategory(formData);

      if (!result.success) {
        setError(result.error || "Operation failed");
      } else {
        setDialogOpen(false);
        setEditingCategory(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return;
    setLoading(true);
    try {
      const result = await deleteCategory(deletingCategory.id);
      if (!result.success) {
        setError(result.error || "Delete failed");
      } else {
        setDeleteDialogOpen(false);
        setDeletingCategory(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingCategory(null);
    setError(null);
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setError(null);
    setDialogOpen(true);
  }

  function openDeleteDialog(category: Category) {
    setDeletingCategory(category);
    setError(null);
    setDeleteDialogOpen(true);
  }

  function renderCategoryGrid(cats: Category[], type: string) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-foreground">
            {type === "INCOME" ? "💰 Income" : "💸 Expense"} Categories
          </h3>
          <Badge variant={type === "INCOME" ? "default" : "secondary"} className="rounded-md px-2.5 py-0.5 text-xs font-semibold">
            {cats.length}
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {cats.map((category) => (
            <Card key={category.id} className="rounded-2xl border-none shadow-sm bg-card p-5 relative group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    type === "INCOME" ? "bg-blue-500/10 text-blue-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    <Tag className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground truncate max-w-[120px] sm:max-w-[150px]">{category.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {category.transactionCount} transactions
                    </p>
                  </div>
                </div>

                {/* Edit / Delete Actions */}
                <div className="flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => openEditDialog(category)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive rounded-lg"
                    onClick={() => openDeleteDialog(category)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Quick Create Card */}
          <button
            onClick={openCreateDialog}
            className="border-2 border-dashed border-muted hover:border-foreground/30 hover:bg-muted/15 transition-all rounded-2xl p-5 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/5 h-20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add {type === "INCOME" ? "Income" : "Expense"} Category
          </button>
        </div>
      </div>
    );
  }

  const totalCategories = categories.length;
  const incomeCount = incomeCategories.length;
  const expenseCount = expenseCategories.length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Total Categories */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Categories</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-foreground">
                {totalCategories}
              </p>
            </div>
          </div>
        </Card>

        {/* Income Categories */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Income Categories</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-blue-500">
                {incomeCount}
              </p>
            </div>
          </div>
        </Card>

        {/* Expense Categories */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Expense Categories</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-foreground">
                {expenseCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grids */}
      <div className="grid gap-8 md:grid-cols-2">
        {renderCategoryGrid(incomeCategories, "INCOME")}
        {renderCategoryGrid(expenseCategories, "EXPENSE")}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category details"
                : "Create a new income or expense category"}
            </DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="cat-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="cat-name"
                name="name"
                placeholder="e.g. Groceries"
                defaultValue={editingCategory?.name || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cat-type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="cat-type"
                name="type"
                defaultValue={editingCategory?.type || "EXPENSE"}
                className="flex h-12 w-full rounded-xl border border-border/40 bg-slate-50 dark:bg-zinc-900/50 px-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <DialogFooter className="pt-2">
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider mt-2">
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl px-5"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
