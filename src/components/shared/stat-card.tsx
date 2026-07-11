import { Card, Space, Typography } from "antd";
import {
  AlertTriangle,
  Banknote,
  GitBranch,
  LucideIcon,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import type { DashboardCard } from "@/types/dashboard-overview/tenant";

const { Text, Title } = Typography;

const cardIconMap: Record<DashboardCard["key"], LucideIcon> = {
  orders: ShoppingCart,
  revenue: Banknote,
  customers: Users,
  products: Package,
  variants: GitBranch,
  lowStockItems: AlertTriangle,
};

const iconBgMap: Record<DashboardCard["key"], string> = {
  orders: "bg-blue-50 text-blue-600",
  revenue: "bg-green-50 text-green-600",
  customers: "bg-purple-50 text-purple-600",
  products: "bg-orange-50 text-orange-600",
  variants: "bg-cyan-50 text-cyan-600",
  lowStockItems: "bg-red-50 text-red-600",
};

const formatCardValue = (stat: DashboardCard) => {
  if (stat.format === "currency") {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: stat.currencyCode ?? "BDT",
      maximumFractionDigits: 0,
    }).format(stat.value);
  }

  return new Intl.NumberFormat("en-BD").format(stat.value);
};

export default function StatCard({ stat }: { stat: DashboardCard }) {
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
