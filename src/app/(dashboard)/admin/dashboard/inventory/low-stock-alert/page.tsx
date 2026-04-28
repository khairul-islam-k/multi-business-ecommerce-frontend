"use client";

import { useState } from "react";
import { Card, Col, Row, Table, Typography, Input, Select, Badge } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockInventoryAlerts, mockWarehouses } from "./data";

const { Search } = Input;
const { Title, Text } = Typography;

export default function LowStockAlertsPage() {
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState<string | undefined>();

  const filteredData = mockInventoryAlerts.filter((a) => {
    const matchesSearch = a.product_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesWarehouse = warehouseFilter
      ? a.warehouse_name === warehouseFilter
      : true;

    return matchesSearch && matchesWarehouse;
  });

  const columns = [
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
      title: "Alert Type",
      dataIndex: "alert_type",
      render: (v: string) =>
        v === "low_stock" ? (
          <Badge status="warning" text="Low Stock" />
        ) : (
          <Badge status="default" text={v} />
        ),
    },
    {
      title: "Threshold Qty",
      dataIndex: "threshold_qty",
      align: "right" as const,
    },
    {
      title: "Resolved",
      dataIndex: "is_resolved",
      render: (v: boolean) => (v ? "Yes" : "No"),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Low Stock Alerts" breadcrumb={adminBreadcrumb} />

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
            placeholder="Filter warehouse"
            allowClear
            style={{ width: "100%", maxWidth: 200 }}
            value={warehouseFilter}
            onChange={setWarehouseFilter}
            options={mockWarehouses.map((w) => ({
              label: w.name,
              value: w.name,
            }))}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Low Stock Alerts</Title>
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
