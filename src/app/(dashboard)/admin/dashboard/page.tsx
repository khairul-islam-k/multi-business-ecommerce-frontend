"use client";

import { useState } from "react";
import type { Dayjs } from "dayjs";
import { Card, Col, DatePicker, Row, Segmented, Space, Typography } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import StatCard from "@/components/shared/stat-card";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import useWidth from "@/hooks/use-width";
import { useAuthStore } from "@/stores/auth.store";
import { useTenantOverviewQuery } from "@/lib/api/hooks/tenant-overview";

const { Title } = Typography;

const DONUT_COLORS = [
  "#1677ff",
  "#52c41a",
  "#faad14",
  "#ff4d4f",
  "#722ed1",
  "#13c2c2",
];

const formatChartDate = (date: string, view: "date" | "month") => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: view === "date" ? "2-digit" : undefined,
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-BD").format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCompactCurrency = (value: number) => {
  return new Intl.NumberFormat("en-BD", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
};

export default function AdminDashboardPage() {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const width = useWidth();

  const [chartView, setChartView] = useState<"date" | "month">("month");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: overviews } = useTenantOverviewQuery(businessId, {
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const statsCart = overviews?.cards ?? [];
  const charts = overviews?.charts ?? [];

  const ordersChart = charts.find((chart) => chart.key === "ordersOverTime");
  const revenueChart = charts.find((chart) => chart.key === "revenueOverTime");
  const orderStatusChart = charts.find(
    (chart) => chart.key === "orderStatusBreakdown",
  );

  const ordersOverTime =
    ordersChart?.data?.map((item) => ({
      label: formatChartDate(String(item.date), chartView),
      orders: Number(item.orders ?? 0),
    })) ?? [];

  const revenueOverTime =
    revenueChart?.data?.map((item) => ({
      label: formatChartDate(String(item.date), chartView),
      revenue: Number(item.revenue ?? 0),
    })) ?? [];

  const orderStatusData =
    orderStatusChart?.data?.map((item) => ({
      status: String(item.status),
      orders: Number(item.orders ?? 0),
    })) ?? [];

  const handleFromDateChange = (date: Dayjs | null) => {
    if (!date) {
      setFromDate("");
      return;
    }

    setFromDate(date.startOf("day").toISOString());
  };

  const handleToDateChange = (date: Dayjs | null) => {
    if (!date) {
      setToDate("");
      return;
    }

    setToDate(date.endOf("day").toISOString());
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" breadcrumb={adminBreadcrumb} />

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Segmented
            value={chartView}
            onChange={(value) => setChartView(value as "date" | "month")}
            options={[
              { label: "Date", value: "date" },
              { label: "Month", value: "month" },
            ]}
          />

          <Space wrap>
            <DatePicker
              placeholder="From date"
              format="YYYY-MM-DD"
              onChange={handleFromDateChange}
            />

            <DatePicker
              placeholder="To date"
              format="YYYY-MM-DD"
              onChange={handleToDateChange}
            />
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {statsCart.map((stat) => (
          <Col xs={width < 360 ? 24 : 12} md={8} key={stat.key}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Revenue Over Time</Title>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={revenueOverTime}
                margin={{ top: 10, right: 20, left: 10, bottom: 55 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  angle={90}
                  textAnchor="start"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `৳${formatCompactCurrency(Number(value))}`
                  }
                />

                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) =>
                    chartView === "date" ? `Date: ${label}` : `Month: ${label}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--dashboard-primary-color)"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Orders Over Time</Title>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={ordersOverTime}
                margin={{ top: 10, right: 20, left: 10, bottom: 55 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="label"
                  angle={90}
                  textAnchor="start"
                  interval={0}
                  height={90}
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => formatNumber(Number(value))}
                  labelFormatter={(label) =>
                    chartView === "date" ? `Date: ${label}` : `Month: ${label}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--dashboard-success-color)"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>Order Status</Title>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="orders"
                  nameKey="status"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    formatNumber(Number(value)),
                    "Orders",
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card>
            <Title level={5}>Order Status Bar</Title>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={orderStatusData}
                margin={{ top: 10, right: 20, left: 10, bottom: 65 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="status"
                  angle={90}
                  textAnchor="start"
                  interval={0}
                  height={100}
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [
                    formatNumber(Number(value)),
                    "Orders",
                  ]}
                />

                <Bar
                  dataKey="orders"
                  fill="var(--dashboard-success-color)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}