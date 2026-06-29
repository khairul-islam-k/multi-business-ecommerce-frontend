"use client";

import Link from "next/link";
import { useState } from "react";
import {
    BarChart3,
    Home,
    LogOut,
    Menu,
    Package,
    Settings,
    ShoppingCart,
    User,
    X,
} from "lucide-react";

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
        href: "/store/dashboard/orders",
        icon: ShoppingCart,
    },
    {
        label: "My Active Cart",
        href: "/store/dashboard/active-cart",
        icon: ShoppingCart,
    },
    {
        label: "My Reviews",
        href: "/store/dashboard/review",
        icon: ShoppingCart,
    },
    {
        label: "Customer Address",
        href: "/store/dashboard/customer-address",
        icon: Package,
    },
    {
        label: "Products",
        href: "/store/dashboard/products",
        icon: Package,
    },
    {
        label: "Analytics",
        href: "/store/dashboard/analytics",
        icon: BarChart3,
    },
    {
        label: "Profile",
        href: "/store/dashboard/profile",
        icon: User,
    },
    {
        label: "Settings",
        href: "/store/dashboard/settings",
        icon: Settings,
    },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
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
          fixed left-0 top-0 z-50 h-screen bg-white shadow-xl transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}
          w-72 lg:translate-x-0
        `}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b px-5">
                    <Link href="/store" className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gray-900 text-white">
                            E
                        </div>

                        {!sidebarCollapsed && (
                            <span className="text-lg font-bold text-gray-900">
                                EasyCom
                            </span>
                        )}
                    </Link>

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

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
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
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
                    <div className="flex items-center gap-3">
                        {/* Mobile sidebar button */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu size={22} />
                        </button>

                        {/* Desktop collapse button */}
                        <button
                            type="button"
                            onClick={() => setSidebarCollapsed((prev) => !prev)}
                            className="hidden rounded-xl p-2 text-gray-600 hover:bg-gray-100 lg:block"
                        >
                            <Menu size={22} />
                        </button>

                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="hidden text-xs text-gray-500 sm:block">
                                Welcome back to your store dashboard
                            </p>
                        </div>
                    </div>

                    {/* Topbar Right */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="hidden rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
                        >
                            View Store
                        </button>

                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full border bg-white p-1.5 pr-3 shadow-sm transition hover:bg-gray-50"
                        >
                            <img
                                src="https://ui-avatars.com/api/?name=User&background=e5e7eb&color=374151&size=128"
                                alt="User avatar"
                                className="size-8 rounded-full object-cover"
                            />

                            <span className="hidden text-sm font-medium text-gray-700 sm:block">
                                User
                            </span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}