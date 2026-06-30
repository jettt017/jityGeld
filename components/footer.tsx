import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background text-xs text-muted-foreground mt-auto">
      <div className="mx-auto flex h-auto sm:h-14 flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:py-0 px-4 sm:px-6">
        <div className="flex-1 text-center sm:text-left">
          © 2026 JityGeld · Version 1.2.0
        </div>

        <div className="flex flex-1 items-center justify-center gap-3">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <span className="opacity-40">·</span>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <span className="opacity-40">·</span>
          <Link href="#" className="hover:text-foreground transition-colors">
            Support
          </Link>
        </div>

        <div className="flex-1 text-center sm:text-right">
          Created by @jettt.ae
        </div>
      </div>
    </footer>
  );
}
