"use client";

import { useMyProfile } from "@/lib/api/hooks/template-product-review";
import {
    CalendarDays,
    CheckCircle2,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from "lucide-react";
import React from "react";

type ProfileResponse = {
    account: {
        email: string;
        emailVerifiedAt: string | null;
        createdAt: string;
    };
    customer: {
        name: string;
        email: string;
        phone: string | null;
        status: "ACTIVE" | "INACTIVE" | string;
        note: string | null;
        createdAt: string;
    };
};

const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getInitials = (name?: string | null) => {
    if (!name) return "U";

    return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const FashionUserProfile = () => {
    const { data: profile, isLoading } = useMyProfile();

    const userProfile = profile as ProfileResponse | undefined;

    const customer = userProfile?.customer;
    const account = userProfile?.account;

    if (isLoading) {
        return (
            <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--store-card,#ffffff)] p-10 text-center shadow-sm">
                    <p className="text-[var(--store-muted,#6b7280)]">
                        Profile is loading...
                    </p>
                </div>
            </section>
        );
    }

    if (!customer || !account) {
        return (
            <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--store-card,#ffffff)] p-10 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-[var(--store-text,#111827)]">
                        Profile not found
                    </h2>
                </div>
            </section>
        );
    }

    const isVerified = Boolean(account.emailVerifiedAt);
    const isActive = customer.status === "ACTIVE";

    return (
        <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--store-text,#111827)]">
                        My Profile
                    </h1>
                    <p className="mt-2 text-sm text-[var(--store-muted,#6b7280)]">
                        Manage your personal account information.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
                    {/* Profile Header */}
                    <div className="bg-[var(--store-primary,#f16d59)] px-6 py-10 text-white sm:px-10">
                        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                            <div className="grid size-28 shrink-0 place-items-center rounded-full border-4 border-white/40 bg-white text-3xl font-bold text-[var(--store-primary,#f16d59)] shadow-lg">
                                {getInitials(customer.name)}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold sm:text-3xl">
                                    {customer.name}
                                </h2>

                                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-white/90 sm:justify-start">
                                    <Mail className="size-4" />
                                    {customer.email}
                                </p>

                                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                        <ShieldCheck className="size-3.5" />
                                        {isActive ? "Active Account" : customer.status}
                                    </span>

                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                                        <CheckCircle2 className="size-3.5" />
                                        {isVerified ? "Email Verified" : "Email Not Verified"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-10">
                        <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--store-secondary,#f8f5f1)] text-[var(--store-primary,#f16d59)]">
                                <User className="size-5" />
                            </div>

                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Full Name
                            </p>
                            <h3 className="mt-1 text-base font-bold text-[var(--store-text,#111827)]">
                                {customer.name}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--store-secondary,#f8f5f1)] text-[var(--store-primary,#f16d59)]">
                                <Mail className="size-5" />
                            </div>

                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Email Address
                            </p>
                            <h3 className="mt-1 break-all text-base font-bold text-[var(--store-text,#111827)]">
                                {customer.email}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--store-secondary,#f8f5f1)] text-[var(--store-primary,#f16d59)]">
                                <Phone className="size-5" />
                            </div>

                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Phone Number
                            </p>
                            <h3 className="mt-1 text-base font-bold text-[var(--store-text,#111827)]">
                                {customer.phone || "Not added"}
                            </h3>
                        </div>

                        <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--store-secondary,#f8f5f1)] text-[var(--store-primary,#f16d59)]">
                                <CalendarDays className="size-5" />
                            </div>

                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Joined Date
                            </p>
                            <h3 className="mt-1 text-base font-bold text-[var(--store-text,#111827)]">
                                {formatDate(customer.createdAt)}
                            </h3>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="border-t border-[var(--store-border,#e5e7eb)] p-6 sm:p-10">
                        <h3 className="text-lg font-bold text-[var(--store-text,#111827)]">
                            Account Information
                        </h3>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center justify-between rounded-2xl bg-[var(--store-secondary,#f8f5f1)] px-5 py-4">
                                <span className="text-sm font-medium text-[var(--store-muted,#6b7280)]">
                                    Status
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {customer.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-[var(--store-secondary,#f8f5f1)] px-5 py-4">
                                <span className="text-sm font-medium text-[var(--store-muted,#6b7280)]">
                                    Email Verification
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${isVerified
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {isVerified ? "Verified" : "Not Verified"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FashionUserProfile;