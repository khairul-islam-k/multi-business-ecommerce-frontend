"use client";

import { Card, Typography } from "antd";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { mockStats } from "../data";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { mockRevenueByPackage, mockRevenueOverTime } from "./data";

const { Text, Title } = Typography;

const COLORS = ["#1677ff", "#52c41a", "#faad14"];

export default function BillingOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing Overview" breadcrumb={superAdminBreadcrumb} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {mockStats.map((s) => {
          const Icon = s.icon;

          return (
            <Card key={s.label} className="shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Text className="text-xs uppercase tracking-wide text-gray-500">
                  {s.label}
                </Text>

                <Icon className="text-gray-400 text-sm" />
              </div>

              <Title level={3} className="m-0! tabular-nums">
                {s.value}
              </Title>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Over Time */}
        <Card
          title={
            <span className="text-base font-medium">Revenue Over Time</span>
          }
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" tick={{ fontSize: 12 }} />

              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />

              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? `$${value.toLocaleString()}`
                    : value
                }
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1677ff"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue by Package */}
        <Card
          title={
            <span className="text-base font-medium">Revenue by Package</span>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockRevenueByPackage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
              >
                {mockRevenueByPackage.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? `$${value.toLocaleString()}`
                    : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
