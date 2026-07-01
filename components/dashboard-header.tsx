"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { TopNav } from "@/components/top-nav";
import {
  Wallet,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  PiggyBank,
  Settings,
  LogOut,
  Plus,
  CalendarDays,
} from "lucide-react";

interface DashboardHeaderProps {
  user: {
    email: string;
    name: string;
    avatarUrl: string;
  };
}

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Calendar", href: "/calendar", icon: CalendarDays },
  { title: "Savings", href: "/savings", icon: PiggyBank },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on window resizing above mobile limits
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard accessibility: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border-premium)] bg-background/80 backdrop-blur-xl px-4 sm:px-6 h-16 flex items-center justify-between transition-colors duration-200 ease-out">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Hamburger button visible below 1024px */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">JityGeld</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:block">
            <TopNav />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Transaction Button hidden on mobile (<768px) but visible on tablet & desktop */}
          <Link
            href="/transactions?add=true"
            className="hidden md:inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm font-bold uppercase tracking-wider text-[11px] h-9 px-3 sm:px-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Link>
          
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <UserNav
            email={user.email}
            name={user.name}
            avatarUrl={user.avatarUrl}
          />
        </div>
      </header>

      {/* Left-Side slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Drawer Menu */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r shadow-2xl p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="font-bold text-base tracking-tight">JityGeld</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Close drawer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="h-px bg-border/40" />

          {/* Embedded Theme Selection Row */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-3">
              Preference
            </p>
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-muted/20 border">
              <span className="text-xs font-semibold text-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Footer actions: Logout */}
        <div className="space-y-4">
          <div className="h-px bg-border/40" />
          <button
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="flex items-center w-full rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="mr-3 h-4.5 w-4.5 text-destructive" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
