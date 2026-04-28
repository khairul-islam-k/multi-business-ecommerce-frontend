"use client";

import { useState } from "react";
import { Card, Col, Row, Table, Typography, Input, Select, Badge } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockPayments } from "./data";

const { Search } = Input;
const { Title, Text } = Typography;

export default function OrderPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredData = mockPayments.filter((p) => {
    const matchesSearch =
      p.order_id.toLowerCase().includes(search.toLowerCase()) ||
      (p.transaction_ref || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter
      ? p.payment_status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
    },
    {
      title: "Method",
      dataIndex: "payment_method",
    },
    {
      title: "Transaction Ref",
      dataIndex: "transaction_ref",
      render: (v: string | null) => <Text code>{v || "—"}</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right" as const,
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      render: (v: string) => {
        const map: Record<string, any> = {
          paid: "success",
          pending: "warning",
          failed: "error",
        };
        return <Badge status={map[v] || "default"} text={v} />;
      },
    },
    {
      title: "Paid At",
      dataIndex: "paid_at",
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Order Payments" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search order/ref..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter status"
            allowClear
            style={{ width: "100%", maxWidth: 200 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Paid", value: "paid" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Order Payments</Title>
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
