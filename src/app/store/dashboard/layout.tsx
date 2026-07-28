"use client";

import {
  FileText,
  Heart,
  Home,
  LogOut,
  MapPinHouse,
  Menu,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";

import AuthGuard from "./auth-guard/auth-guard";
import AvatarDropdown from "@/app/templates/fashion/_components/avatar-dropdown";
import Link from "next/link";
import LogoComponent from "@/app/templates/fashion/_components/logo/logo-component";
import { useState } from "react";
import StoreThemeToggle from "../_components/store-theme-switcher";
import { usePathname } from "next/navigation";
import { useCart } from "../_components/contex/CartContex";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/store/dashboard",
    icon: Home,
  },
  {
    label: "Orders",
    href: "/store/dashboard/order-history",
    icon: ShoppingBag,
  },
  {
    label: "Active Cart",
    href: "/store/dashboard/active-cart",
    icon: ShoppingCart,
  },
  {
    label: "Reviews",
    href: "/store/dashboard/review",
    icon: Star,
  },
  {
    label: "Addresses",
    href: "/store/dashboard/customer-address",
    icon: MapPinHouse,
  },
  {
    label: "Return Orders",
    href: "/store/dashboard/return",
    icon: RotateCcw,
  },
  {
    label: "Wishlist",
    href: "/store/dashboard/wishlist",
    icon: Heart,
  },
  {
    label: "Invoice",
    href: "/store/dashboard/invoice",
    icon: FileText,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const pathname = usePathname();
  const { handleLogout } = useCart();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--store-bg-1)]">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed left-0 top-0 z-50 h-screen bg-[var(--store-sidebar-bg)] text-[var(--store-sidebar-text)] shadow-xl transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}
          w-72 lg:translate-x-0
        `}
        >
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-[var(--store-border)] border-b px-5">
            <LogoComponent sidebarCollapsed={sidebarCollapsed} />

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="space-y-1 px-3 py-5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/store/dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                      ? "bg-gray-200 text-black shadow-sm"
                      : "text-[var(--store-sidebar-text)] hover:bg-[var(--store-primary)]/10 hover:text-[var(--store-primary)]"
                    }`}
                >
                  <Icon size={20} />

                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={20} />

              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div
          className={`
          min-h-screen transition-all duration-300
          ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"}
        `}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--store-border)] bg-[var(--store-bg-1)] px-4 shadow-sm lg:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile sidebar button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={22} />
              </button>

              {/* Desktop collapse button */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="hidden rounded-xl p-2 hover:bg-gray-100 lg:block"
              >
                <Menu size={22} />
              </button>

              <div>
                <h1 className="text-lg font-semibold">
                  Dashboard
                </h1>
                <p className="hidden text-xs sm:block">
                  Welcome back to your store dashboard
                </p>
              </div>
            </div>

            {/* Topbar Right */}
            <div className="flex items-center gap-3">
              <StoreThemeToggle />

              <AvatarDropdown />
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
