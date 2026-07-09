"use client";

import { Card, Row, Col, Typography, Table, Space, Badge } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useWidth from "@/hooks/use-width";
import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import {
  mockStats,
  mockMrrData,
  mockTenantGrowth,
  mockTenants,
  mockAlerts,
} from "./data";

const { Title, Text } = Typography;

const tenantColumns = [
  {
    title: "Business",
    dataIndex: "business",
    key: "business",
    render: (v: string) => <Text strong>{v}</Text>,
  },
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    render: (v: string) => <Text type="secondary">{v}</Text>,
  },
  {
    title: "Package",
    dataIndex: "package",
    key: "package",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      if (status === "Active") return <Badge status="success" text="Active" />;

      if (status === "Trial") return <Badge status="processing" text="Trial" />;

      return <Badge status="error" text={status} />;
    },
  },
];

export default function DashboardPage() {
  const width = useWidth();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" breadcrumb={superAdminBreadcrumb} />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => {
          return (
            <Col xs={width < 360 ? 24 : 12} md={8} lg={4} key={stat.label}>
              <StatCard stat={stat} />
            </Col>
          );
        })}
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Title level={5}>MRR Growth</Title>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockMrrData}>
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

        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>Tenant Growth</Title>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockTenantGrowth}>
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

      {/* Table + Alerts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Title level={5}>Recent Tenant Sign-ups</Title>

            <Table
              columns={tenantColumns}
              dataSource={mockTenants.slice(0, 4)}
              pagination={false}
              rowKey="id"
              size="small"
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>System Alerts</Title>

            <Space orientation="vertical" style={{ width: "100%" }}>
              {mockAlerts.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      a.severity === "error"
                        ? "bg-red-500"
                        : a.severity === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />

                  <div>
                    <Text>{a.message}</Text>

                    <br />

                    <Text type="secondary" className="text-xs">
                      {a.time}
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
