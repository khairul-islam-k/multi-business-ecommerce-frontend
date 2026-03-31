"use client";

import { useState } from "react";
import { Card, Col, Row, Table, Typography, Badge, Input, Select } from "antd";

import { mockInventoryTransactions } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { formatCurrency, formatDate } from "./utils";

const { Search } = Input;
const { Title, Text } = Typography;

export default function InventoryTransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const filteredData = mockInventoryTransactions.filter((t) => {
    const matchesSearch = t.product_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter ? t.transaction_type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      render: (v: string) => <Text type="secondary">{formatDate(v)}</Text>,
      width: 140,
    },
    {
      title: "Product",
      render: (_: any, record: any) => (
        <Text strong>{record.product_name}</Text>
      ),
    },
    {
      title: "Warehouse",
      render: (_: any, record: any) => record.warehouse_name,
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      render: (type: string) =>
        type === "IN" ? (
          <Badge status="success" text="IN" />
        ) : (
          <Badge status="default" text={type} />
        ),
      width: 100,
    },
    {
      title: "Reference",
      dataIndex: "reference_id",
      render: (v: string | null) => <Text code>{v || "—"}</Text>,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      align: "right" as const,
      render: (v: number) => (
        <Text type={v > 0 ? "success" : "danger"} strong>
          {v > 0 ? `+${v}` : v}
        </Text>
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "unit_cost",
      align: "right" as const,
      render: (v: number | null) => (v ? formatCurrency(v) : "—"),
    },
    {
      title: "By",
      dataIndex: "created_by",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Transactions" breadcrumb={adminBreadcrumb} />

      {/* Search & Filter */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search product..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter type"
            allowClear
            style={{ width: "100%", maxWidth: 156 }}
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: "IN", value: "IN" },
              { label: "OUT", value: "OUT" },
            ]}
          />
        </Col>
      </Row>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Transactions</Title>
            <Table
              columns={columns}
              dataSource={filteredData}
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
