"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  white?: boolean;
}

export default function Logo({ collapsed = false, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 shrink-0", className)}
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground font-display font-extrabold text-lg shadow-soft">
        O
      </div>
      {!collapsed && (
        <span className="font-display text-2xl font-bold tracking-tight">
          One<span className="text-muted-foreground font-medium">comm</span>
        </span>
      )}
    </Link>
  );
}
