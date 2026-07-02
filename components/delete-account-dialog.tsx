"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { deleteAccount } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isReady = confirmed && confirmText === "DELETE";

  function handleClose() {
    if (isPending) return; // Block close during deletion
    onOpenChange(false);
    // Reset state after dialog close animation
    setTimeout(() => {
      setConfirmed(false);
      setConfirmText("");
      setError(null);
    }, 200);
  }

  function handleDelete() {
    if (!isReady) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteAccount();

      if (!result.success) {
        setError(result.error ?? "Failed to delete account. Please try again later.");
        return;
      }

      // Success — redirect to login
      router.push("/login");
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={!isPending}
        className="sm:max-w-md gap-0 p-0 overflow-hidden"
      >
        {/* Red accent stripe at top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 rounded-t-2xl" />

        <div className="p-6 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
                <TriangleAlert className="h-4.5 w-4.5" />
              </div>
              <DialogTitle className="text-base text-foreground normal-case tracking-normal">
                Delete your account?
              </DialogTitle>
            </div>
            <DialogDescription className="text-[13px] leading-relaxed">
              This will permanently delete your account, profile, transactions,
              savings goals, analytics, and all associated data.{" "}
              <span className="font-semibold text-foreground">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Checklist */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={isPending}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "h-4.5 w-4.5 rounded-md border-2 transition-all duration-150",
                  "flex items-center justify-center",
                  confirmed
                    ? "bg-destructive border-destructive"
                    : "border-border bg-background group-hover:border-muted-foreground"
                )}
              >
                {confirmed && (
                  <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[13px] text-muted-foreground leading-snug select-none group-hover:text-foreground transition-colors">
              I understand that this action is{" "}
              <span className="font-semibold text-foreground">permanent</span> and all
              my data will be lost.
            </span>
          </label>

          {/* Confirm input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Type{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-bold text-foreground tracking-widest">
                DELETE
              </code>{" "}
              to continue
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              disabled={isPending}
              className={cn(
                "font-mono tracking-widest transition-all",
                confirmText === "DELETE" && "border-destructive ring-1 ring-destructive/30"
              )}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30 px-3 py-2.5 text-[12px] text-rose-600 dark:text-rose-400">
              <TriangleAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 pt-0 gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 sm:flex-none h-10 rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!isReady || isPending}
            className={cn(
              "flex-1 sm:flex-none h-10 rounded-xl text-xs font-bold gap-1.5 transition-all",
              !isReady && "opacity-50 cursor-not-allowed"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting Account...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
