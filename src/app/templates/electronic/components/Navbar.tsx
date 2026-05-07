"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LogIn, Menu, ShoppingBag, X, Zap } from "lucide-react";
import { useState } from "react";

import { useCart } from "./contex/CartContex";

type Props = {
  site: {
    name: string;
    logo?: string;
    templateName: string;
  };
};

export function ElectronicNavBar({ site }: Props) {
  const pathname = usePathname();
  const { count } = useCart();
  const params = useParams();

  const domain = params.domain as string;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    {
      href: `/store/${domain}`,
      label: "Home",
    },
    {
      href: `/store/${domain}/products`,
      label: "Products",
    },
    {
      href: `/store/${domain}/about`,
      label: "About Us",
    },
    {
      href: `/store/${domain}/contact`,
      label: "Contact Us",
    },
  ];

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  if (site.templateName !== "electronic") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          href={`/store/${domain}`}
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 text-xl font-bold text-gray-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <Zap className="h-4 w-4 text-white" />
          </span>

          <span>{site.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                isActiveLink(link.href)
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Login */}
          <Link
            href={`/store/${domain}/login`}
            className="hidden items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 md:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Link>

          {/* Cart */}
          <Link
            href={`/store/${domain}/cart`}
            className="relative inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />

            <span className="hidden sm:inline">Cart</span>

            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-yellow-400 px-1 text-[10px] font-bold text-gray-900">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-900 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 md:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActiveLink(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Login Button */}
            <Link
              href={`/store/${domain}/login`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}