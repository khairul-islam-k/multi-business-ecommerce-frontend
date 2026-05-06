"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Typography,
  Badge,
  Input,
  Select,
} from "antd";

import { mockAccounts } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusColors: Record<string, any> = {
  Active: "success",
  Inactive: "default",
};

export default function AccountsList() {
  const totalBalance = useMemo(
    () => mockAccounts.reduce((s, a) => s + a.current, 0),
    [],
  );

  const columns = [
    {
      title: "Account",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) => (
        <Link
          href={`/admin/dashboard/accounts/${record.id}`}
          className="font-medium"
        >
          {record.name}
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (val: string) => <Text type="secondary">{val}</Text>,
    },
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
      render: (val: string | null) => (
        <Text type="secondary">{val || "—"}</Text>
      ),
    },
    {
      title: "Opening",
      dataIndex: "opening",
      key: "opening",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-mono">${val.toLocaleString()}</span>
      ),
    },
    {
      title: "Current",
      dataIndex: "current",
      key: "current",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-mono font-medium">${val.toLocaleString()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge status={statusColors[status] || "default"} text={status} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Accounts" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Accounts</Text>
            <Title level={4}>{mockAccounts.length}</Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Balance</Text>
            <Title level={4}>
              $
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Receivables</Text>
            <Title level={4}>$45,200</Title>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Payables</Text>
            <Title level={4}>$18,750</Title>
          </Card>
        </Col>
      </Row>

      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            style={{ minWidth: 200 }}
          />

          <Select style={{ width: 150 }} defaultValue="all">
            <option value="all">All Types</option>
            <option value="bank">Bank</option>
            <option value="revenue">Revenue</option>
            <option value="cash">Cash</option>
          </Select>
        </div>

        <Col>
          <Link href="/admin/dashboard/finance/accounts/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Account
            </Button>
          </Link>
        </Col>
      </div>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={mockAccounts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No accounts found." }}
        />
      </Card>
    </div>
  );
}
