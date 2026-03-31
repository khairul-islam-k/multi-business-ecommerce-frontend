"use client";

import { Card, Col, Row, Table, Typography, Badge } from "antd";

import { mockInventoryTransactions } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { formatCurrency, formatDate, getProduct, getWarehouse } from "./utils";

const { Title, Text } = Typography;

export default function InventoryTransactionsPage() {
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
        <Text strong>{getProduct(record.product_id)?.name}</Text>
      ),
    },
    {
      title: "Warehouse",
      render: (_: any, record: any) => getWarehouse(record.warehouse_id)?.name,
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
    // {
    //   title: "Note",
    //   dataIndex: "note",
    //   render: (v: string) => <Text ellipsis={{ tooltip: v }}>{v}</Text>,
    //   width: 200,
    // },
    {
      title: "By",
      dataIndex: "created_by",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Transactions" breadcrumb={adminBreadcrumb} />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Transactions</Title>
            <Table
              columns={columns}
              dataSource={mockInventoryTransactions}
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
