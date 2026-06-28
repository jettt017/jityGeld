"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  PiggyBank,
  Target,
  Calendar,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  createSavingsGoal,
  updateSavingsGoal,
  addFundsToGoal,
  deleteSavingsGoal,
} from "@/actions/savings";
import { formatCurrency, formatDate, calculatePercentage } from "@/utils";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  createdAt: string;
}

interface SavingsClientProps {
  goals: SavingsGoal[];
}

export function SavingsClient({ goals }: SavingsClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fundsDialogOpen, setFundsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [fundingGoal, setFundingGoal] = useState<SavingsGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = editingGoal
        ? await updateSavingsGoal(editingGoal.id, formData)
        : await createSavingsGoal(formData);

      if (!result.success) {
        setError(result.error || "Operation failed");
      } else {
        setDialogOpen(false);
        setEditingGoal(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFunds(formData: FormData) {
    if (!fundingGoal) return;
    setLoading(true);
    setError(null);
    try {
      const result = await addFundsToGoal(fundingGoal.id, formData);
      if (!result.success) {
        setError(result.error || "Failed to add funds");
      } else {
        setFundsDialogOpen(false);
        setFundingGoal(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingGoal) return;
    setLoading(true);
    try {
      const result = await deleteSavingsGoal(deletingGoal.id);
      if (!result.success) {
        setError(result.error || "Delete failed");
      } else {
        setDeleteDialogOpen(false);
        setDeletingGoal(null);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  function openCreateDialog() {
    setEditingGoal(null);
    setError(null);
    setDialogOpen(true);
  }

  function openEditDialog(goal: SavingsGoal) {
    setEditingGoal(goal);
    setError(null);
    setDialogOpen(true);
  }

  function openDeleteDialog(goal: SavingsGoal) {
    setDeletingGoal(goal);
    setError(null);
    setDeleteDialogOpen(true);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Total Target */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Target</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-foreground">
                {formatCurrency(totalTarget)}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Saved */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Saved</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-cyan-500">
                {formatCurrency(totalSaved)}
              </p>
            </div>
          </div>
        </Card>

        {/* Overall Progress */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Overall Progress</p>
              <p className="text-xl font-extrabold tracking-tight mt-0.5 text-foreground">
                {overallProgress}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid Header & New Goal Button */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-foreground">My Savings Goals</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={openCreateDialog} className="rounded-xl px-5 h-12">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Goal
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? "Edit Goal" : "New Savings Goal"}
              </DialogTitle>
              <DialogDescription>
                {editingGoal
                  ? "Update your savings goal details"
                  : "Set a new savings target"}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  name="title"
                  placeholder="e.g. Laptop Gaming"
                  defaultValue={editingGoal?.title || ""}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Amount</label>
                  <Input
                    name="targetAmount"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    defaultValue={editingGoal?.targetAmount || ""}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Deadline <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <Input
                    name="deadline"
                    type="date"
                    defaultValue={editingGoal?.deadline || ""}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider mt-2">
                  {editingGoal ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const percentage = calculatePercentage(
            goal.currentAmount,
            goal.targetAmount
          );
          const isCompleted = percentage >= 100;

          return (
            <Card
              key={goal.id}
              className={`rounded-2xl border-none shadow-sm bg-card p-6 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md ${
                isCompleted ? "ring-2 ring-cyan-500/30" : ""
              }`}
            >
              {isCompleted && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-none hover:bg-cyan-500/10 rounded-md font-bold px-2.5 py-0.5 text-[10px]">
                    ✓ Completed
                  </Badge>
                </div>
              )}
              
              <div className="space-y-5 flex-1">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isCompleted ? "bg-cyan-500/10 text-cyan-500" : "bg-primary/10 text-primary"
                  }`}>
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <div className="max-w-[150px] sm:max-w-[180px]">
                    <h3 className="font-bold text-foreground text-base truncate">{goal.title}</h3>
                    {goal.deadline ? (
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(goal.deadline)}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground mt-0.5">No deadline</p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={isCompleted ? "text-cyan-500 dark:text-cyan-400" : "text-foreground"}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-gradient-to-r from-cyan-400 to-cyan-500"
                          : "bg-gradient-to-r from-indigo-500 to-primary"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 border-t border-muted/30 pt-4 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                      Saved
                    </p>
                    <p className="font-extrabold text-sm text-cyan-500 dark:text-cyan-400">
                      {formatCurrency(goal.currentAmount)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                      Target
                    </p>
                    <p className="font-extrabold text-sm text-foreground">
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-muted/20">
                {!isCompleted ? (
                  <Button
                    size="sm"
                    className="flex-1 rounded-lg h-9 font-medium text-xs"
                    onClick={() => {
                      setFundingGoal(goal);
                      setError(null);
                      setFundsDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Funds
                  </Button>
                ) : (
                  <div className="flex-1 text-center py-1.5 text-xs text-muted-foreground font-medium bg-muted/30 rounded-lg h-9 flex items-center justify-center">
                    Goal achieved!
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg shrink-0"
                  onClick={() => openEditDialog(goal)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/5 shrink-0"
                  onClick={() => openDeleteDialog(goal)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}

        {/* Quick Create Card */}
        <button
          onClick={openCreateDialog}
          className="border-2 border-dashed border-muted hover:border-foreground/30 hover:bg-muted/15 transition-all rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-sm font-semibold text-muted-foreground bg-muted/5 min-h-[240px] cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 text-muted-foreground">
            <Plus className="h-6 w-6" />
          </div>
          <span>Add Savings Goal</span>
        </button>
      </div>

      {/* Add Funds Dialog */}
      <Dialog open={fundsDialogOpen} onOpenChange={setFundsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Add money to &quot;{fundingGoal?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <form action={handleAddFunds} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {fundingGoal && (
              <div className="rounded-2xl bg-muted/50 p-4 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current savings:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(fundingGoal.currentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target goal:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(fundingGoal.targetAmount)}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                name="amount"
                type="number"
                min="1"
                step="1000"
                placeholder="0"
                className="rounded-xl"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider mt-2">
                Add Funds
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Savings Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingGoal?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
