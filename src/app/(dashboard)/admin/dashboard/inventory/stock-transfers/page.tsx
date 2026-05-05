"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Table, Typography, Button, Tag, Col, Input, Select } from "antd";

import { mockTransfers, mockWarehouses } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Title, Text } = Typography;
const { Search } = Input;

export default function StockTransferListPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredData = mockTransfers.filter((t) => {
    const matchesSearch = t.transfer_no
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesWarehouse = warehouseFilter
      ? t.from_warehouse_name === warehouseFilter ||
        t.to_warehouse_name === warehouseFilter
      : true;

    const matchesStatus = statusFilter ? t.status === statusFilter : true;

    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const columns = [
    {
      title: "Transfer No",
      dataIndex: "transfer_no",
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "From",
      dataIndex: "from_warehouse_name",
    },
    {
      title: "To",
      dataIndex: "to_warehouse_name",
    },
    {
      title: "Items",
      dataIndex: "total_items",
      align: "right" as const,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        if (status === "approved") return <Tag color="green">Approved</Tag>;
        if (status === "rejected") return <Tag color="red">Rejected</Tag>;
        return <Tag color="orange">Pending</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (v: string) => <Text type="secondary">{v}</Text>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Transfers" breadcrumb={adminBreadcrumb} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search transfer..."
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter warehouse"
              allowClear
              style={{ width: "100%" }}
              value={warehouseFilter}
              onChange={setWarehouseFilter}
              options={mockWarehouses.map((w) => ({
                label: w.name,
                value: w.name,
              }))}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter status"
              allowClear
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ]}
            />
          </Col>
        </div>

        <Button
          type="primary"
          onClick={() =>
            router.push("/admin/dashboard/inventory/stock-transfers/create")
          }
        >
          Create Transfer
        </Button>
      </div>

      <Card>
        <Title level={5}>All Transfers</Title>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
