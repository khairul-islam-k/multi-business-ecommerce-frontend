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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {stat.label}
          </p>

          <h3 className="text-2xl font-bold text-slate-900">
            {formatCardValue(stat)}
          </h3>

          <p className="text-xs text-slate-500">Last 30 days overview</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBgMap[stat.key]}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}