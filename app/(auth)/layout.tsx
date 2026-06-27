export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-zinc-200/50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-background p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
