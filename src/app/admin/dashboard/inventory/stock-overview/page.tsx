"use client";

import { Card, Col, Row, Table, Typography } from "antd";

import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

import { mockInventories, mockStats } from "./data";
import { getProduct, getWarehouse, formatCurrency } from "./utils";

const { Title, Text } = Typography;

export default function StockOverviewPage() {
  const columns = [
    {
      title: "Product",
      render: (_: any, record: any) => {
        const p = getProduct(record.product_id);
        return <Text strong>{p?.name}</Text>;
      },
    },
    {
      title: "SKU",
      render: (_: any, record: any) => {
        const p = getProduct(record.product_id);
        return <Text type="secondary">{p?.sku}</Text>;
      },
    },
    {
      title: "Warehouse",
      render: (_: any, record: any) => {
        const w = getWarehouse(record.warehouse_id);
        return w?.name;
      },
    },
    {
      title: "Available",
      dataIndex: "available_qty",
      align: "right" as const,
    },
    {
      title: "Reserved",
      dataIndex: "reserved_qty",
      align: "right" as const,
    },
    {
      title: "Damaged",
      dataIndex: "damaged_qty",
      align: "right" as const,
    },
    {
      title: "Lost",
      dataIndex: "lost_qty",
      align: "right" as const,
    },
    {
      title: "Avg Cost",
      dataIndex: "avg_cost",
      align: "right" as const,
      render: (v: number) => formatCurrency(v),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Overview" breadcrumb={adminBreadcrumb} />

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {mockStats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <StatCard stat={stat} />
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>All Stock</Title>

            <Table
              columns={columns}
              dataSource={mockInventories}
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
