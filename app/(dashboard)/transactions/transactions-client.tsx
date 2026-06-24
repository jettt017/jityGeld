"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createTransaction, updateTransaction, deleteTransaction } from "@/actions/transactions";
import { formatCurrency, formatDate } from "@/utils";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  transactionDate: string;
  categoryId: string;
  categoryName: string;
  categoryType: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Filters {
  search?: string;
  type?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

interface TransactionsClientProps {
  transactions: Transaction[];
  categories: Category[];
  totalPages: number;
  currentPage: number;
  total: number;
  totalIncome: number;
  totalExpense: number;
  filters: Filters;
}

export function TransactionsClient({
  transactions,
  categories,
  totalPages,
  currentPage,
  total,
  totalIncome,
  totalExpense,
  filters,
}: TransactionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(editingTx?.type || "EXPENSE");
  const [showFilters, setShowFilters] = useState(
    !!(filters.type || filters.categoryId || filters.startDate || filters.endDate)
  );

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      openCreateDialog();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("add");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      router.replace(`/transactions${newQuery}`, { scroll: false });
    }
  }, [searchParams, router]);

  function updateSearchParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/transactions?${params.toString()}`);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/transactions?${params.toString()}`);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = editingTx
        ? await updateTransaction(editingTx.id, formData)
        : await createTransaction(formData);

      if (!result.success) {
        setError(result.error || "Operation failed");
      } else {
        setDialogOpen(false);
        setEditingTx(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingTx) return;
    setLoading(true);
    try {
      const result = await deleteTransaction(deletingTx.id);
      if (!result.success) {
        setError(result.error || "Delete failed");
      } else {
        setDeleteDialogOpen(false);
        setDeletingTx(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingTx(null);
    setSelectedType("EXPENSE");
    setError(null);
    setDialogOpen(true);
  }

  function openEditDialog(tx: Transaction) {
    setEditingTx(tx);
    setSelectedType(tx.type);
    setError(null);
    setDialogOpen(true);
  }

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const totalVolume = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Total Volume */}
        <Card className="rounded-[28px] border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Volume</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-foreground">
                {formatCurrency(totalVolume)}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Income */}
        <Card className="rounded-[28px] border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Income</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-emerald-500">
                +{formatCurrency(totalIncome)}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Expense */}
        <Card className="rounded-[28px] border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Expense</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-foreground">
                -{formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-[24px] shadow-sm">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              defaultValue={filters.search || ""}
              className="pl-9 rounded-full bg-muted/40 border-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length === 0 || value.length >= 2) {
                  updateSearchParams({ search: value || undefined });
                }
              }}
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="icon"
            className="rounded-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={openCreateDialog} className="rounded-full px-5 py-4">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Transaction
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTx ? "Edit Transaction" : "New Transaction"}
              </DialogTitle>
              <DialogDescription>
                {editingTx
                  ? "Update transaction details"
                  : "Record a new income or expense"}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    name="type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="categoryId"
                    defaultValue={editingTx?.categoryId || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select...</option>
                    {filteredCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    defaultValue={editingTx?.amount || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    name="transactionDate"
                    type="date"
                    defaultValue={
                      editingTx?.transactionDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  name="description"
                  placeholder="e.g. Lunch at restaurant"
                  defaultValue={editingTx?.description || ""}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {editingTx ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="rounded-[32px] border-none shadow-sm bg-card p-6">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Type
                </label>
                <select
                  className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={filters.type || ""}
                  onChange={(e) =>
                    updateSearchParams({ type: e.target.value || undefined })
                  }
                >
                  <option value="">All</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <select
                  className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={filters.categoryId || ""}
                  onChange={(e) =>
                    updateSearchParams({
                      categoryId: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  From
                </label>
                <Input
                  type="date"
                  className="h-9 w-auto"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    updateSearchParams({
                      startDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  To
                </label>
                <Input
                  type="date"
                  className="h-9 w-auto"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    updateSearchParams({
                      endDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push("/transactions");
                  setShowFilters(false);
                }}
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="rounded-[32px] border-none shadow-sm bg-card p-6 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm">
                      {formatDate(tx.transactionDate)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {tx.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.type === "INCOME" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        tx.type === "INCOME"
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(tx)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeletingTx(tx);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1}–
            {Math.min(currentPage * 10, total)} of {total} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
