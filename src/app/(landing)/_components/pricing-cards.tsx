"use client";

import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenantPackagePlans } from "@/lib/api";
import { cn } from "@/lib/utils";

type BillingCycle = "MONTHLY" | "YEARLY" | "LIFETIME";

type PackageFeature = {
    id: string;
    title: string;
    sortOrder: number;
    isActive: boolean;
};

type PackageLimit = {
    id: string;
    limitKey: string;
    limitValue: number;
    resetCycle: string;
};

type PackagePlan = {
    id: string;
    name: string;
    description: string | null;
    price: string;
    billingCycle: BillingCycle;
    currencyCode: string;
    freeTrialDays: number;
    isDefault: boolean;
    status: "ACTIVE" | "INACTIVE";
    sortOrder: number;
    features: PackageFeature[];
    limits: PackageLimit[];
};

type ApiResponseShape =
    | PackagePlan[]
    | {
        data?: PackagePlan[] | { plans?: PackagePlan[] };
        plans?: PackagePlan[];
    };

function getPlans(data: ApiResponseShape | undefined): PackagePlan[] {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.data)) return data.data;

    if (Array.isArray(data?.plans)) return data.plans;

    if (
        data?.data &&
        !Array.isArray(data.data) &&
        Array.isArray(data.data.plans)
    ) {
        return data.data.plans;
    }

    return [];
}

function formatPrice(price: string, currencyCode: string) {
    const amount = Number(price);

    if (Number.isNaN(amount)) return price;

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: currencyCode || "BDT",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatBillingCycle(cycle: BillingCycle) {
    if (cycle === "MONTHLY") return "/mo";
    if (cycle === "YEARLY") return "/yr";
    return "";
}

export default function PricingCards() {
    const { data, isLoading, isError, error } = useTenantPackagePlans();

    console.log('pricing', data);

    const plans = getPlans(data as ApiResponseShape | undefined)
        .filter((plan) => plan.status === "ACTIVE")
        .sort((a, b) => a.sortOrder - b.sortOrder);

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-[520px] rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                        Failed to load pricing plans.
                        {error instanceof Error ? ` ${error.message}` : ""}
                    </div>
                </div>
            </section>
        );
    }

    if (!plans.length) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border bg-white p-6 text-center text-slate-600">
                        No pricing plans found.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                        Simple pricing for every business
                    </h2>
                    <p className="mt-3 text-slate-600">
                        Choose a plan that fits your business size and growth stage.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {plans.map((plan) => {
                        const isPopular =
                            plan.name.toLowerCase() === "growth" || plan.isDefault;

                        const activeFeatures = [...(plan.features ?? [])]
                            .filter((feature) => feature.isActive)
                            .sort((a, b) => a.sortOrder - b.sortOrder);

                        return (
                            <article
                                key={plan.id}
                                className={cn(
                                    "relative flex min-h-[520px] flex-col rounded-2xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                    isPopular &&
                                    "border-transparent bg-gradient-to-b from-indigo-600 to-violet-600 text-white shadow-2xl"
                                )}
                            >
                                {isPopular && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-slate-950">
                                        <Sparkles className="mr-1 h-3 w-3" />
                                        Most Popular
                                    </Badge>
                                )}

                                <div>
                                    <h3
                                        className={cn(
                                            "text-xl font-bold text-slate-950",
                                            isPopular && "text-white"
                                        )}
                                    >
                                        {plan.name}
                                    </h3>

                                    <div className="mt-5 flex items-end gap-1">
                                        <span
                                            className={cn(
                                                "text-4xl font-extrabold tracking-tight text-slate-950",
                                                isPopular && "text-white"
                                            )}
                                        >
                                            {formatPrice(plan.price, plan.currencyCode)}
                                        </span>

                                        <span
                                            className={cn(
                                                "mb-1 text-sm font-medium text-slate-500",
                                                isPopular && "text-indigo-100"
                                            )}
                                        >
                                            {formatBillingCycle(plan.billingCycle)}
                                        </span>
                                    </div>

                                    <p
                                        className={cn(
                                            "mt-3 text-sm text-slate-500",
                                            isPopular && "text-indigo-100"
                                        )}
                                    >
                                        billed {plan.billingCycle.toLowerCase()}
                                    </p>

                                    {plan.description && (
                                        <p
                                            className={cn(
                                                "mt-5 min-h-[48px] text-sm leading-6 text-slate-600",
                                                isPopular && "text-indigo-50"
                                            )}
                                        >
                                            {plan.description}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    className={cn(
                                        "mt-7 h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700",
                                        isPopular &&
                                        "bg-white text-slate-950 hover:bg-indigo-50 hover:text-slate-950"
                                    )}
                                >
                                    {plan.freeTrialDays > 0
                                        ? `Start ${plan.freeTrialDays}-Day Free Trial`
                                        : "Start Free Trial"}
                                </Button>

                                <div className="mt-7 flex-1 space-y-4">
                                    {activeFeatures.length > 0 ? (
                                        activeFeatures.map((feature) => (
                                            <div key={feature.id} className="flex items-start gap-3">
                                                <Check
                                                    className={cn(
                                                        "mt-0.5 h-4 w-4 shrink-0 text-indigo-600",
                                                        isPopular && "text-white"
                                                    )}
                                                />
                                                <span
                                                    className={cn(
                                                        "text-sm text-slate-700",
                                                        isPopular && "font-medium text-white"
                                                    )}
                                                >
                                                    {feature.title}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className={cn(
                                                "text-sm text-slate-500",
                                                isPopular && "text-indigo-100"
                                            )}
                                        >
                                            Features will be added soon.
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
