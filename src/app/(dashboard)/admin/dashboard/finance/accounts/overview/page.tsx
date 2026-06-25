"use client";

import { Card, Col, Row, Typography } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockMonthlyData, mockProfitData, mockStats } from "./data";

const { Title } = Typography;

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Account Overview" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => (
          <Col lg={6} md={12} xs={24} key={stat.value}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Revenue vs Expense</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--dashboard-border-subtle-color)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="var(--dashboard-primary-color)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill="var(--dashboard-error-color)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Profit Trend</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockProfitData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--dashboard-border-subtle-color)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--dashboard-success-color)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--dashboard-primary-color)"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
