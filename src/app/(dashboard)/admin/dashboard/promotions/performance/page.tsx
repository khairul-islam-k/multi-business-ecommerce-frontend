"use client";

import {
  Banknote,
  ShoppingCart,
  Tag,
  TrendingUp
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import StatCard, { Stat } from "@/components/shared/stat-card";

import { Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import { mockPromotions } from "../data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function PromotionPerformance() {
  // 📊 Mock performance data
  const performanceData = mockPromotions.slice(0, 10).map((p) => ({
    name: p.name.slice(0, 10),
    uses: Math.floor(Math.random() * 500) + 50,
    revenue: Math.floor(Math.random() * 10000) + 1000,
  }));

  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][i],
    revenue: Math.floor(Math.random() * 50000) + 10000,
  }));

  // 📈 Aggregates
  const totalUses = performanceData.reduce((s, d) => s + d.uses, 0);
  const totalRevenue = performanceData.reduce((s, d) => s + d.revenue, 0);

  const avgDiscount = Math.round(
    mockPromotions.reduce((s, p) => s + p.discount_value, 0) /
      mockPromotions.length,
  );

  // 📦 StatCard data (YOUR format)
  const stats: Stat[] = [
    {
      label: "Active Promotions",
      value: String(mockPromotions.filter((p) => p.status === "active").length),
      up: true,
      change: "+8%",
      icon: Tag,
    },
    {
      label: "Total Uses",
      value: totalUses.toLocaleString(),
      up: true,
      change: "+12%",
      icon: ShoppingCart,
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      up: true,
      change: "+18%",
      icon: Banknote,
    },
    {
      label: "Avg Discount",
      value: `${avgDiscount}%`,
      up: false,
      change: "-2%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Promotion Performance" breadcrumb={adminBreadcrumb} />

      {/* 📊 Stats */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, i) => (
          <Col xs={24} sm={12} md={12} lg={6} key={i}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* 📉 Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Promotion Usage">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uses" radius={[4, 4, 0, 0]} fill="var(--dashboard-success-color)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Revenue Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
