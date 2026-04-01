"use client";

import { Card, Col, Row, Typography } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import StatCard from "@/components/shared/stat-card";
import { mockStats, mockOrders } from "./data";

const { Title } = Typography;

const COLORS = [
  "hsl(220,60%,45%)",
  "hsl(142,60%,40%)",
  "hsl(45,93%,47%)",
  "hsl(262,52%,50%)",
  "hsl(0,72%,51%)",
  "hsl(25,80%,50%)",
];

export default function OrderAnalytics() {
  const statusCounts: Record<string, number> = {};
  mockOrders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyRevenue: Record<string, number> = {};
  mockOrders.forEach((o) => {
    const month = new Date(o.created_at).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + o.total;
  });
  const revenueData = Object.entries(monthlyRevenue).map(([name, revenue]) => ({
    name,
    revenue: Math.round(revenue),
  }));

  const dailyOrders: Record<string, number> = {};
  mockOrders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dailyOrders[day] = (dailyOrders[day] || 0) + 1;
  });

  const dailyData = Object.entries(dailyOrders)
    .map(([name, count]) => ({ name, count }))
    .slice(-14);

  const regionData: Record<string, { count: number; revenue: number }> = {};
  mockOrders.forEach((o) => {
    if (!regionData[o.region]) regionData[o.region] = { count: 0, revenue: 0 };
    regionData[o.region].count++;
    regionData[o.region].revenue += o.total;
  });

  const regionChartData = Object.entries(regionData)
    .map(([region, data]) => ({
      region,
      ...data,
      revenue: Math.round(data.revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const channelData: Record<string, { count: number; revenue: number }> = {};
  mockOrders.forEach((o) => {
    if (!channelData[o.channel])
      channelData[o.channel] = { count: 0, revenue: 0 };
    channelData[o.channel].count++;
    channelData[o.channel].revenue += o.total;
  });

  const channelChartData = Object.entries(channelData)
    .map(([channel, data]) => ({
      name: channel,
      ...data,
      revenue: Math.round(data.revenue),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      <PageHeader title="Order Analytics" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => (
          <Col xs={24} md={12} lg={6}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Revenue by Month</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,13%,90%)"
                />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Order Status Distribution</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent || 0 * 100).toFixed(0)}%`
                  }
                  fontSize={12}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Title level={4}>Order Over Time</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,13%,90%)"
                />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Channel Distribution</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="revenue"
                  label={({ name, percent }) =>
                    `${name} ${(percent || 0 * 100).toFixed(0)}%`
                  }
                  fontSize={12}
                >
                  {channelChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Revenue by Region</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionChartData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,13%,90%)"
                />
                <XAxis type="number" fontSize={12} />
                <YAxis
                  dataKey="region"
                  type="category"
                  fontSize={12}
                  width={120}
                />
                <Tooltip />
                <Bar dataKey="revenue" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
