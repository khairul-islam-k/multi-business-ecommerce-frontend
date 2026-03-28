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
import {
  mockChurnData,
  mockNewSubs,
  mockPlanDist,
  mockRevenueTrend,
} from "./data";

const { Title } = Typography;
const { Option } = Select;

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
              <LineChart data={mockRevenueTrend}>
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
              <LineChart data={mockChurnData}>
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
              <BarChart data={mockNewSubs}>
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
                  data={mockPlanDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent! * 100).toFixed(0)}%`
                  }
                >
                  {mockPlanDist.map((_, i) => (
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
