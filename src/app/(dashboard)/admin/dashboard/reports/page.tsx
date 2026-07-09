"use client";

import {
  Banknote,
  ChartBar,
  FileText,
  ShoppingBag,
  TrendingUp,
  Truck
} from "lucide-react";


import Link from "next/link";
import { Card, Row, Col, Typography } from "antd";

import StatCard, { Stat } from "@/components/shared/stat-card";

const { Title, Text } = Typography;

const stats: Stat[] = [
  {
    label: "Total Revenue",
    value: "₹32,45,000",
    change: "+12.5% vs last month",
    up: true,
    icon: Banknote,
  },
  {
    label: "Total Orders",
    value: "2,450",
    change: "+8.3% vs last month",
    up: true,
    icon: ShoppingBag,
  },
  {
    label: "Avg Order Value",
    value: "₹1,325",
    change: "-2.1% vs last month",
    up: false,
    icon: ChartBar,
  },
  {
    label: "Net Profit Margin",
    value: "18.2%",
    change: "+1.5% vs last month",
    up: true,
    icon: TrendingUp,
  },
];

const reportModules = [
  {
    title: "Sales Reports",
    path: "/admin/dashboard/reports/sales",
    icon: TrendingUp,
    description: "Revenue, top products, and sales trends",
    stat: "₹32.4L",
  },
  {
    title: "Order Reports",
    path: "/admin/dashboard/reports/orders",
    icon: FileText,
    description: "Order volume, status, and fulfillment",
    stat: "2,450",
  },
  {
    title: "Inventory Reports",
    path: "/admin/dashboard/reports/inventory",
    icon: ShoppingBag,
    description: "Stock levels, turnover, and dead stock",
    stat: "12,800 SKUs",
  },
  {
    title: "Supplier Reports",
    path: "/admin/dashboard/reports/suppliers",
    icon: Truck,
    description: "Supplier performance and procurement",
    stat: "34 Suppliers",
  },
  {
    title: "Courier Reports",
    path: "/admin/dashboard/reports/couriers",
    icon: Truck,
    description: "Delivery times and courier performance",
    stat: "5 Partners",
  },
  {
    title: "Expense Reports",
    path: "/admin/dashboard/reports/expenses",
    icon: Banknote,
    description: "Operating expenses and cost analysis",
    stat: "₹8.2L",
  },
  {
    title: "Financial Reports",
    path: "/admin/dashboard/reports/financial",
    icon: ChartBar,
    description: "P&L, balance sheet, and cash flow",
    stat: "₹24.2L Net",
  },
  {
    title: "Revenue Reports",
    path: "/admin/dashboard/reports/revenue",
    icon: TrendingUp,
    description: "Revenue breakdown and growth trends",
    stat: "+12.5%",
  },
  {
    title: "Profit Reports",
    path: "/admin/dashboard/reports/profit",
    icon: Banknote,
    description: "Margins, COGS, and net profit",
    stat: "18.2%",
  },
];

export default function ReportsOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Card>
          <Title level={4} style={{ margin: 0 }}>
            Reports & Analytics
          </Title>
          <Text type="secondary">
            Comprehensive business intelligence and reporting
          </Text>
        </Card>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* Modules */}
      <Title level={5}>Report Modules</Title>

      <Row gutter={[16, 16]}>
        {reportModules.map((mod) => {
          const Icon = mod.icon;

          return (
            <Col xs={24} sm={12} lg={8} key={mod.path}>
              <Link href={mod.path}>
                <Card
                  hoverable
                  style={{ height: "100%" }}
                  bodyStyle={{ padding: 16 }}
                >  
                  <div style={{ display: "flex", gap: 12 }}>
                    <div
                      style={{
                        background: "var(--dashboard-sidebar-active-background-color)",
                        padding: 10,
                        borderRadius: 8,
                        height: "fit-content",
                      }}
                    >
                      <Icon style={{ fontSize: 18, color: "var(--dashboard-primary-color)" }} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <Text strong>{mod.title}</Text>

                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {mod.description}
                        </Text>
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <Text strong style={{ fontSize: 16 }}>
                          {mod.stat}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
