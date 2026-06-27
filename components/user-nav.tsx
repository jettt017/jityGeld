"use client";

import { signOut } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";

interface UserNavProps {
  email: string;
  name: string;
  avatarUrl?: string;
}

export function UserNav({ email, name, avatarUrl }: UserNavProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-primary/5 hover:ring-4 transition-all">
            <Avatar className="h-9 w-9">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-72 rounded-xl p-1 shadow-lg border border-border/40 bg-popover" align="end">
        {/* Profile Header (Vercel/Linear style with Avatar + Name + Email) */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 min-w-0 border-b border-border/40 pb-2.5 mb-1.5">
          <Avatar className="h-8 w-8 shrink-0 border border-primary/10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate leading-none">{name}</p>
            <p className="text-[10px] text-muted-foreground truncate leading-none mt-1">{email}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <DropdownMenuItem
          className="rounded-lg px-2 py-1.5 cursor-pointer text-xs font-semibold"
          render={
            <Link href="/settings" className="flex items-center w-full">
              <User className="mr-2 h-3.5 w-3.5 text-muted-foreground group-hover/dropdown-menu-item:text-foreground" />
              My Profile
            </Link>
          }
        />
        
        <DropdownMenuItem
          className="rounded-lg px-2 py-1.5 cursor-pointer text-xs font-semibold"
          render={
            <Link href="/settings" className="flex items-center w-full">
              <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground group-hover/dropdown-menu-item:text-foreground" />
              Settings
            </Link>
          }
        />

        <DropdownMenuSeparator className="my-1.5" />

        {/* Logout Action */}
        <DropdownMenuItem
          className="rounded-lg px-2 py-1.5 text-destructive focus:text-destructive cursor-pointer text-xs font-semibold"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-3.5 w-3.5 text-destructive" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
