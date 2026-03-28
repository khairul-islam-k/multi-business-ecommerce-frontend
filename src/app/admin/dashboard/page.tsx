"use client";

import { Badge, Card, Col, Row, Table, Typography } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useWidth from "@/hooks/use-width";
import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  mockStats,
  mockSalesOverview,
  mockCustomerGrowth,
  mockOrders,
} from "./data";

const { Title, Text } = Typography;

const orderColumns = [
  {
    title: "Order",
    dataIndex: "orderId",
    key: "orderId",
    render: (v: string) => <Text strong>{v}</Text>,
  },
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    render: (v: string) => <Text type="secondary">{v}</Text>,
  },
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      if (status === "Delivered")
        return <Badge status="success" text="Delivered" />;

      if (status === "Processing")
        return <Badge status="processing" text="Processing" />;

      return <Badge status="error" text={status} />;
    },
  },
];

export default function AdminDashboardPage() {
  const width = useWidth();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => (
          <Col xs={width < 360 ? 24 : 12} md={6} key={stat.label}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card>
            <Title level={5}>Sales Analytics</Title>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockSalesOverview}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis tickFormatter={(v) => `$${v / 10000}k`} />

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

        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>Customer Growth</Title>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockCustomerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#52c41a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Recent Orders</Title>

            <Table
              columns={orderColumns}
              dataSource={mockOrders.slice(0, 4)}
              pagination={false}
              rowKey="id"
              size="small"
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
