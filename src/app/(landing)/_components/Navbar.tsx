"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/shared/shadcn-theme-toggle";
import Logo from "@/components/shared/logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact Us" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-accent/60 backdrop-blur-xl border-b border-border/60" />
      <div className="px-2 md:px-0 container mx-auto relative flex h-20 items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/sign-in"
            className="flex items-center h-10 px-5 rounded-full border border-foreground/80 text-sm font-semibold text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/sign-in"
            className="h-10 px-5 rounded-full gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5"
          >
            Create Your Store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-background"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full bg-foreground rounded-full transition-all duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-foreground rounded-full transition-all duration-200 ${
                  open ? "opacity-0 scale-x-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-full bg-foreground rounded-full transition-all duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-[82%] max-w-sm bg-background border-r border-border shadow-elevated transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-border">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={() => setOpen(false)}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground font-display font-extrabold text-lg shadow-soft">
                O
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                One
                <span className="text-muted-foreground font-medium">Comm</span>
              </span>
            </Link>
          </div>

          <nav className="flex flex-col px-3 py-5">
            {links.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
                className={`px-4 py-3 rounded-xl text-base font-medium text-foreground/90 hover:bg-accent hover:text-primary transition-all duration-300 ${
                  open
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border bg-background grid gap-2.5">
            <Link
              href="/sign-in"
              className="flex-items-center h-11 rounded-full border border-foreground text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/sign-in"
              className="h-11 rounded-full inline-flex items-center justify-center gap-1.5"
            >
              Create Your Store <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
};
