"use client";

import { useState } from "react";
import { Card, Col, Row, Table, Typography, Input, Select, Badge } from "antd";

import { mockReturns } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Search } = Input;
const { Title, Text } = Typography;

export default function OrderReturnsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredData = mockReturns.filter((r) => {
    const matchesSearch =
      r.return_no.toLowerCase().includes(search.toLowerCase()) ||
      r.order_id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? r.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Return No",
      dataIndex: "return_no",
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Condition",
      dataIndex: "condition",
    },
    {
      title: "Refund",
      dataIndex: "refund_amount",
      align: "right" as const,
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map: Record<string, any> = {
          pending: "warning",
          approved: "success",
          rejected: "error",
        };
        return <Badge status={map[v] || "default"} text={v} />;
      },
    },
    {
      title: "Received At",
      dataIndex: "received_at",
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Order Returns" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search return/order..."
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
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Order Returns</Title>
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
