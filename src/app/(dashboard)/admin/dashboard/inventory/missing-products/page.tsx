"use client";

import { useState } from "react";
import { Card, Col, Row, Table, Typography, Input, Select } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockMissingProducts, mockWarehouses } from "./data";

const { Search } = Input;
const { Title, Text } = Typography;

export default function MissingProductsPage() {
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState<string | undefined>();

  const filteredData = mockMissingProducts.filter((m) => {
    const matchesSearch = m.product_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter
      ? m.warehouse_name === warehouseFilter
      : true;
    return matchesSearch && matchesWarehouse;
  });

  const columns = [
    {
      title: "Product",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => (
        <Text strong>{record.product_name}</Text>
      ),
    },
    {
      title: "Warehouse",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => record.warehouse_name,
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      align: "right" as const,
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (v: string) => <Text ellipsis={{ tooltip: v }}>{v}</Text>,
      width: 200,
    },
    {
      title: "Reported By",
      dataIndex: "reported_by",
    },
    {
      title: "Reported At",
      dataIndex: "reported_at",
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Missing Products" breadcrumb={adminBreadcrumb} />

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
            <Title level={5}>Missing Products</Title>
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
