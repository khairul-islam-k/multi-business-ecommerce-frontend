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
                  stroke="hsl(220 13% 91%)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="hsl(220, 70%, 50%)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill="hsl(0, 72%, 51%)"
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
                  stroke="hsl(220 13% 91%)"
                />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(160, 60%, 45%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(220, 70%, 50%)"
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
