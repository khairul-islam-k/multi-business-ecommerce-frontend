"use client";

import { useState } from "react";
import { Card, Select, Row, Col, Space, Typography } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const { Title } = Typography;
const { Option } = Select;

const revenueTrend = [
  { month: "Jul", value: 98000 },
  { month: "Aug", value: 105000 },
  { month: "Sep", value: 112000 },
  { month: "Oct", value: 118000 },
  { month: "Nov", value: 124000 },
  { month: "Dec", value: 128000 },
  { month: "Jan", value: 132000 },
  { month: "Feb", value: 128430 },
];

const churnData = [
  { month: "Jul", value: 2.1 },
  { month: "Aug", value: 1.8 },
  { month: "Sep", value: 2.3 },
  { month: "Oct", value: 1.5 },
  { month: "Nov", value: 1.9 },
  { month: "Dec", value: 1.2 },
  { month: "Jan", value: 1.6 },
  { month: "Feb", value: 1.4 },
];

const newSubs = [
  { month: "Jul", value: 45 },
  { month: "Aug", value: 52 },
  { month: "Sep", value: 38 },
  { month: "Oct", value: 61 },
  { month: "Nov", value: 48 },
  { month: "Dec", value: 55 },
  { month: "Jan", value: 67 },
  { month: "Feb", value: 42 },
];

const planDist = [
  { name: "Starter", value: 234 },
  { name: "Growth", value: 567 },
  { name: "Enterprise", value: 189 },
];

const COLORS = ["#1677ff", "#52c41a", "#faad14"];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("6m");
  const [pkgFilter, setPkgFilter] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader title="Revenue Reports" breadcrumb={superAdminBreadcrumb} />

      {/* Filters */}

      <Space>
        <Select
          value={dateRange}
          onChange={setDateRange}
          style={{ width: 180 }}
        >
          <Option value="1m">Last 30 days</Option>
          <Option value="3m">Last 3 months</Option>
          <Option value="6m">Last 6 months</Option>
          <Option value="1y">Last year</Option>
        </Select>

        <Select
          value={pkgFilter}
          onChange={setPkgFilter}
          style={{ width: 160 }}
        >
          <Option value="all">All Packages</Option>
          <Option value="starter">Starter</Option>
          <Option value="growth">Growth</Option>
          <Option value="enterprise">Enterprise</Option>
        </Select>
      </Space>

      {/* Charts */}

      <Row gutter={[24, 24]}>
        {/* Revenue Trend */}

        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Revenue Trend</Title>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis tickFormatter={(v) => `$${v / 1000}k`} />

                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? `$${value.toLocaleString()}`
                      : value
                  }
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1677ff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Churn */}

        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Subscription Churn (%)</Title>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={churnData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis tickFormatter={(v) => `${v}%`} />

                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? `$${value.toLocaleString()}`
                      : value
                  }
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* New Subscriptions */}

        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>New Subscriptions</Title>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={newSubs}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#52c41a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Plan Distribution */}

        <Col xs={24} lg={12}>
          <Card>
            <Title level={5}>Plan Distribution</Title>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={planDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent! * 100).toFixed(0)}%`
                  }
                >
                  {planDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
