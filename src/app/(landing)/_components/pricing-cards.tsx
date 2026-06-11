"use client";

import { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";

import { useTenantPackageMutations, useTenantPackagePlans, useTenantPackageUsage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type BillingCycle = "MONTHLY" | "YEARLY" | "LIFETIME";

type PackageFeature = {
    id: string;
    title: string;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
};

type PackageLimit = {
    id: string;
    limitKey: string;
    limitValue: number;
    resetCycle: string;
    description: string | null;
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
    limits: PackageLimit[];
    features: PackageFeature[];
};

type PackagePlansResponse = {
    items: PackagePlan[];
};

function formatPrice(price: string, currencyCode: string) {
    const amount = Number(price);

    if (Number.isNaN(amount)) {
        return price;
    }

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: currencyCode || "BDT",
        maximumFractionDigits: 0,
    }).format(amount);
}

function getBillingLabel(cycle: BillingCycle) {
    if (cycle === "MONTHLY") return "/mo";
    if (cycle === "YEARLY") return "/yr";
    return "";
}

function getButtonText(plan: PackagePlan) {
    if (plan.freeTrialDays > 0) {
        return `Start ${plan.freeTrialDays}-Day Free Trial`;
    }

    return "Get Start";
}

export default function PricingCards() {
    const mutations = useTenantPackageMutations();
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("YEARLY");
    const swal = useSwal();
    const router = useRouter();

    const { data, isLoading, isError, error } = useTenantPackagePlans();

    const visiblePlans = useMemo(() => {
        // ✅ Main fix: your API response is { items: [...] }
        const plans = (data as PackagePlansResponse | undefined)?.items ?? [];

        return plans
            .filter((plan) => plan.status === "ACTIVE")
            .filter((plan) => plan.billingCycle === billingCycle)
            .sort((a, b) => {
                if (a.sortOrder !== b.sortOrder) {
                    return a.sortOrder - b.sortOrder;
                }

                return Number(a.price) - Number(b.price);
            });
    }, [data, billingCycle]);

    const handleBuyPackage = async (id: string) => {
        try {
            const payment = await mutations.checkoutPlan.mutateAsync(id);

            console.log("payment", payment);

            swal.modal.confirm({
                title: "Confirm mock payment?",
                content: "Confirm payment payment",
                okText: "Confirm payment",
                cancelText: "Cancel",
                async onOk() {
                    try {
                        await mutations.confirmMockPayment.mutateAsync(payment.id);

                        router.push("/admin/dashboard");
                        toast.success("Plan changed successfully.");
                    } catch (error) {
                        toast.error("Payment confirmation failed.");
                    }
                },
                onCancel() {
                    toast.success("Checkout created. Confirm it before it expires.");
                },
            });
        } catch (error) {
            toast.error("Please log in first.");
            router.push("/sign-in");
        }
    };

    if (isLoading) {
        return (
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-[540px] rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                        Failed to load pricing plans.
                        {error instanceof Error ? ` ${error.message}` : ""}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className=" py-16">

            <div className="text-center mb-5">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
                    Pricing
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                    Simple plans that{" "}
                    <span className="text-gradient">scale with you.</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Start free. Upgrade when you grow. Cancel anytime.
                </p>
            </div>

            <div className="container mx-auto px-4">
                <div className="mb-12 flex justify-center">
                    <div className="inline-flex rounded-full border bg-white p-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setBillingCycle("MONTHLY")}
                            className={cn(
                                "rounded-full px-6 py-3 text-sm font-semibold transition",
                                billingCycle === "MONTHLY"
                                    ? "bg-indigo-600 text-white shadow"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Monthly
                        </button>

                        <button
                            type="button"
                            onClick={() => setBillingCycle("YEARLY")}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
                                billingCycle === "YEARLY"
                                    ? "bg-indigo-600 text-white shadow"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Yearly
                            <span
                                className={cn(
                                    "rounded-full px-2 py-1 text-[10px] font-bold",
                                    billingCycle === "YEARLY"
                                        ? "bg-white/20 text-white"
                                        : "bg-indigo-50 text-indigo-600"
                                )}
                            >
                                SAVE 20%
                            </span>
                        </button>
                    </div>
                </div>

                {visiblePlans.length === 0 ? (
                    <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
                        No {billingCycle.toLowerCase()} pricing plans found.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {visiblePlans.map((plan) => {
                            const isPopular =
                                plan.name.toLowerCase() === "growth" || plan.isDefault;

                            const features = [...(plan.features ?? [])]
                                .filter((feature) => feature.isActive)
                                .sort((a, b) => a.sortOrder - b.sortOrder);

                            return (
                                <article
                                    key={plan.id}
                                    className={cn(
                                        "relative flex min-h-[540px] flex-col rounded-2xl border border-slate-200 bg-accent p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
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
                                                "text-xl font-bold",
                                                isPopular && "text-white"
                                            )}
                                        >
                                            {plan.name}
                                        </h3>

                                        <div className="mt-5 flex items-end gap-1">
                                            <span
                                                className={cn(
                                                    "text-4xl font-extrabold tracking-tight ",
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
                                                {getBillingLabel(plan.billingCycle)}
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

                                        <p
                                            className={cn(
                                                "mt-5 min-h-[48px] text-sm leading-6 text-slate-600",
                                                isPopular && "text-indigo-50"
                                            )}
                                        >
                                            {plan.description || "Perfect plan to start your business."}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => handleBuyPackage(plan?.id)}
                                        className={cn(
                                            "mt-7 h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700",
                                            isPopular &&
                                            "bg-white text-slate-950 hover:bg-indigo-50 hover:text-slate-950"
                                        )}
                                    >
                                        {getButtonText(plan)}
                                    </Button>

                                    <div className="mt-7 flex-1 space-y-4">
                                        {features.length > 0 ? (
                                            features.map((feature) => (
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
                                            <p
                                                className={cn(
                                                    "text-sm text-slate-500",
                                                    isPopular && "text-indigo-100"
                                                )}
                                            >
                                                Features will be added soon.
                                            </p>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}