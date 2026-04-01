"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Typography,
  Badge,
} from "antd";

import { mockOrders } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;
const { Option } = Select;

const statusColors: Record<string, any> = {
  pending: "#722ed1",
  processing: "processing",
  shipped: "default",
  delivered: "success",
  cancelled: "warning",
  returned: "error",
};

export default function OrdersList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      const matchSearch =
        o.order_no.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || o.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalRevenue = useMemo(
    () => mockOrders.reduce((s, o) => s + o.total, 0),
    [],
  );

  const deliveredCount = mockOrders.filter(
    (o) => o.status === "delivered",
  ).length;
  const pendingCount = mockOrders.filter((o) => o.status === "pending").length;

  const columns = [
    {
      title: "Order",
      dataIndex: "order_no",
      key: "order_no",
      render: (_: any, record: any) => (
        <Link
          href={`/admin/dashboard/orders/${record.id}`}
          className="font-mono text-sm"
        >
          {record.order_no}
        </Link>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = statusColors[status];
        const isPreset = [
          "success",
          "processing",
          "default",
          "error",
          "warning",
        ].includes(color);
        return (
          <Badge
            {...(isPreset ? { status: color } : { color })}
            text={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        );
      },
    },
    {
      title: "Channel",
      dataIndex: "channel",
      key: "channel",
      render: (val: any) => <Text type="secondary">{val}</Text>,
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      render: (val: any) => <Text type="secondary">{val}</Text>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (val: any) => (
        <span className="font-mono">${val.toFixed(2)}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: any) => (
        <Text type="secondary">{new Date(val).toLocaleDateString()}</Text>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Total Orders</Text>
            <Title level={4}>{mockOrders.length}</Title>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Revenue</Text>
            <Title level={4}>
              $
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Title>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Delivered</Text>
            <Title level={4}>{deliveredCount}</Title>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Text type="secondary">Pending</Text>
            <Title level={4}>{pendingCount}</Title>
          </Card>
        </Col>
      </Row>

      {/* Toolbar */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="returned">Returned</Option>
          </Select>
        </Col>

        <Col>
          <Link href="/admin/dashboard/orders/create">
            <Button type="primary" icon={<PlusOutlined />}>
              New Order
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No orders found." }}
        />
      </Card>
    </div>
  );
}
