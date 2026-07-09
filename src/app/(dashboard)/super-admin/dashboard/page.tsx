"use client";

import { Card, Col, DatePicker, Row, Segmented, Space, Typography } from "antd";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import useWidth from "@/hooks/use-width";
import { useAdminOverviewQuery } from "@/lib/api/hooks/admin-overview";

import PlatformStatCard from "./_components/platform-stat-card";

import type { Dayjs } from "dayjs";

const { Title } = Typography;

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

type ChartDataItem = Record<string, string | number>;

const getChartData = (
  charts: {
    key: string;
    label: string;
    type: string;
    data: ChartDataItem[];
  }[],
  key: string,
) => {
  return charts.find((chart) => chart.key === key);
};

export default function DashboardPage() {
  const width = useWidth();

  const [chartView, setChartView] = useState<"date" | "month">("month");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const { data: overviews } = useAdminOverviewQuery({
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  const cards = overviews?.cards ?? [];
  const charts = (overviews?.charts ?? []) as {
    key: string;
    label: string;
    type: string;
    data: ChartDataItem[];
  }[];

  const tenantsChart = getChartData(charts, "tenantsOverTime");
  const businessesChart = getChartData(charts, "businessesOverTime");
  const ordersChart = getChartData(charts, "ordersOverTime");
  const revenueChart = getChartData(charts, "revenueOverTime");

  const tenantsOverTime =
    tenantsChart?.data?.map((item) => ({
      label: formatChartDate(String(item.date), chartView),
      tenants: Number(item.tenants ?? 0),
    })) ?? [];

  const businessesOverTime =
    businessesChart?.data?.map((item) => ({
      label: formatChartDate(String(item.date), chartView),
      businesses: Number(item.businesses ?? 0),
    })) ?? [];

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
      <PageHeader title="Dashboard" breadcrumb={superAdminBreadcrumb} />

      {/* Chart Controls */}
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

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {cards.map((stat) => (
          <Col xs={width < 360 ? 24 : 12} md={6} lg={6} key={stat.key}>
            <PlatformStatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Tenants Over Time</Title>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={tenantsOverTime}
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
                  dataKey="tenants"
                  stroke="#1677ff"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Businesses Over Time</Title>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={businessesOverTime}
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
                  dataKey="businesses"
                  stroke="#52c41a"
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
                  stroke="#faad14"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

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
                  stroke="#722ed1"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
