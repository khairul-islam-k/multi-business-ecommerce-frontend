import {
  Banknote,
  Clock3,
  Heart,
  RotateCcw,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

import type { CustomerDashboardCard } from "@/types/dashboard-overview/customer";

const cardIconMap: Record<CustomerDashboardCard["key"], LucideIcon> = {
  orders: ShoppingCart,
  totalSpent: Banknote,
  pendingOrders: Clock3,
  returns: RotateCcw,
  wishlistItems: Heart,
};

const iconBgMap: Record<CustomerDashboardCard["key"], string> = {
  orders: "bg-blue-50 text-blue-600",
  totalSpent: "bg-green-50 text-green-600",
  pendingOrders: "bg-orange-50 text-orange-600",
  returns: "bg-red-50 text-red-600",
  wishlistItems: "bg-pink-50 text-pink-600",
};

const formatCardValue = (stat: CustomerDashboardCard) => {
  if (stat.format === "currency") {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: stat.currencyCode ?? "BDT",
      maximumFractionDigits: 0,
    }).format(stat.value);
  }

  return new Intl.NumberFormat("en-BD").format(stat.value);
};

export default function OverviewCard({
  stat,
}: {
  stat: CustomerDashboardCard;
}) {
  const Icon = cardIconMap[stat.key];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex w-full flex-col gap-3">
        {/* Header: label left, icon right */}
        <div className="flex w-full items-center justify-between gap-4">
          <p className="min-w-0 flex-1 truncate text-xs font-medium uppercase tracking-wide text-slate-500">
            {stat.label}
          </p>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgMap[stat.key]}`}
          >
            <Icon size={22} />
          </div>
        </div>

        {/* Value */}
        <h3 className="text-xl font-semibold text-slate-900">
          {formatCardValue(stat)}
        </h3>

        {/* Footer text */}
        <p className="text-xs text-slate-500">Last 30 days overview</p>
      </div>
    </div>
  );
}