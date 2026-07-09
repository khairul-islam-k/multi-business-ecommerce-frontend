import { Card, Space, Typography } from "antd";
import {
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Landmark,
  LucideIcon,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

import { PlatformDashboardCard } from "@/types/dashboard-overview/super-admin";

const { Text, Title } = Typography;

const cardIconMap: Record<PlatformDashboardCard["key"], LucideIcon> = {
  tenants: Users,
  activeTenants: CheckCircle2,
  businesses: Building2,
  activeBusinesses: Store,
  orders: ShoppingCart,
  platformOrderRevenue: Banknote,
  activeSubscriptions: CreditCard,
  packageRevenue: Landmark,
};

const iconBgMap: Record<PlatformDashboardCard["key"], string> = {
  tenants: "bg-blue-50 text-blue-600",
  activeTenants: "bg-green-50 text-green-600",
  businesses: "bg-purple-50 text-purple-600",
  activeBusinesses: "bg-cyan-50 text-cyan-600",
  orders: "bg-orange-50 text-orange-600",
  platformOrderRevenue: "bg-emerald-50 text-emerald-600",
  activeSubscriptions: "bg-indigo-50 text-indigo-600",
  packageRevenue: "bg-amber-50 text-amber-600",
};

const formatCardValue = (stat: PlatformDashboardCard) => {
  if (stat.format === "currency") {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: stat.currencyCode ?? "BDT",
      maximumFractionDigits: 0,
    }).format(stat.value);
  }

  return new Intl.NumberFormat("en-BD").format(stat.value);
};

export default function PlatformStatCard({
  stat,
}: {
  stat: PlatformDashboardCard;
}) {
  const Icon = cardIconMap[stat.key];

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <Space direction="vertical" size={4}>
          <Text type="secondary" className="text-xs uppercase">
            {stat.label}
          </Text>

          <Title
            level={3}
            style={{
              margin: 0,
            }}
          >
            {formatCardValue(stat)}
          </Title>

          <Text type="secondary" className="text-xs">
            Last 30 days overview
          </Text>
        </Space>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBgMap[stat.key]}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
