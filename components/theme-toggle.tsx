"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 transition-transform duration-200 active:scale-90"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-400 ease-out dark:-rotate-180 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-180 scale-0 transition-all duration-400 ease-out dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <span>Light</span>
          </div>
          {mounted && theme === "light" && (
            <Check className="h-3.5 w-3.5 animate-in fade-in zoom-in-50 duration-200 ease-out" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-muted-foreground" />
            <span>Dark</span>
          </div>
          {mounted && theme === "dark" && (
            <Check className="h-3.5 w-3.5 animate-in fade-in zoom-in-50 duration-200 ease-out" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span>System</span>
          </div>
          {mounted && theme === "system" && (
            <Check className="h-3.5 w-3.5 animate-in fade-in zoom-in-50 duration-200 ease-out" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
