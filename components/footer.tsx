import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full mt-8 sm:mt-10 border-t border-border shadow-sm bg-card text-xs text-muted-foreground relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-6 md:px-8">
        <div className="flex-1 text-center sm:text-left">
          © 2026 JityGeld · Version 1.2.0
        </div>

        <div className="flex flex-1 items-center justify-center gap-3">
          <Link href="/privacy" className="hover:text-foreground transition-colors font-medium">
            Privacy
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/terms" className="hover:text-foreground transition-colors font-medium">
            Terms
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/support" className="hover:text-foreground transition-colors font-medium">
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
