"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "All", href: "/dashboard" },
  { title: "Transactions", href: "/transactions" },
  { title: "Analytics", href: "/analytics" },
  { title: "Calendar", href: "/calendar" },
  { title: "Savings", href: "/savings" },
  { title: "Settings", href: "/settings" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative py-2 transition-colors hover:text-foreground/80",
              isActive ? "text-foreground font-semibold" : "text-muted-foreground"
            )}
          >
            {item.title}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
