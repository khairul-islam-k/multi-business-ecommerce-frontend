"use client";

import { Card, Col, Row, Table, Typography } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

import {
  mockInventories,
  mockWarehouses,
  getProduct,
  getWarehouse,
  formatCurrency,
} from "./data";

const { Title, Text } = Typography;

export default function InventoryValueReportPage() {
  // total value
  const totalValue = mockInventories.reduce(
    (s, i) => s + i.available_qty * i.avg_cost,
    0,
  );

  // per warehouse value
  const warehouseValues = mockWarehouses.map((w) => {
    const items = mockInventories.filter((i) => i.warehouse_id === w.id);

    return {
      ...w,
      value: items.reduce((s, i) => s + i.available_qty * i.avg_cost, 0),
      items: items.length,
    };
  });

  const columns = [
    {
      title: "Product",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => {
        const product = getProduct(record.product_id);
        return <Text strong>{product?.name}</Text>;
      },
    },
    {
      title: "Warehouse",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => {
        const warehouse = getWarehouse(record.warehouse_id);
        return warehouse?.name;
      },
    },
    {
      title: "Qty",
      dataIndex: "available_qty",
      align: "right" as const,
    },
    {
      title: "Avg Cost",
      dataIndex: "avg_cost",
      align: "right" as const,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: "Total Value",
      align: "right" as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => (
        <Text strong>
          {formatCurrency(record.available_qty * record.avg_cost)}
        </Text>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Value Report" breadcrumb={adminBreadcrumb} />

      {/* Warehouse Summary */}
      <Row gutter={[16, 16]}>
        {warehouseValues.map((w) => (
          <Col xs={24} md={8} key={w.id}>
            <Card>
              <div className="flex flex-col gap-1">
                <Text type="secondary">{w.name}</Text>
                <Title level={3} className="mb-0!">
                  {formatCurrency(w.value)}
                </Title>
                <Text type="secondary" className="text-xs">
                  {w.items} products
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Title level={5} className="mb-0!">
            Detailed Breakdown
          </Title>
          <Title level={4} className="mb-0!">
            {formatCurrency(totalValue)}
          </Title>
        </div>

        <Table
          columns={columns}
          dataSource={mockInventories}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
