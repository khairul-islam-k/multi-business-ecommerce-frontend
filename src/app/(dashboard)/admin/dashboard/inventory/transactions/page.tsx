"use client";

import { useState } from "react";
import { Card, Col, Row, Table, Typography, Input, Select, Tag } from "antd";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ColumnsType } from "antd/es/table";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/shared/pagination";
import { DataTable } from "@/components/shared/data-table";

const { Search } = Input;
const { Title } = Typography;

export type InventoryTransaction = {
  id: string;
  uuid: string;
  createdAt: string;
  transactionType: string;
  referenceType: string;
  referenceId: string;
  qty: number;
  unitCost: string;
  note: string;

  product?: {
    id: string;
    sku: string;
    name: string;
  };

  warehouse?: {
    id: string;
    name: string;
  };
};

export default function InventoryTransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [value] = useDebounce(search, 1000);

  // pagination
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  const { data: transaction } = useQuery({
    queryKey: ["transaction", value, page, limit, typeFilter],
    queryFn: async () => {
      if (typeFilter) {
        return api.get(
          `/transactions?search=${value}&transactionType=${typeFilter}&tenantId=1&page=${page}&limit=${limit}&sortOrder=DESC`,
        );
      } else {
        return api.get(
          `/transactions?search=${value}&tenantId=1&page=${page}&limit=${limit}&sortOrder=DESC`,
        );
      }
    },
  });

  // pagination
  const total = transaction?.data?.data?.meta?.total;
  const totalPages = Math.ceil(total / limit);

  const columns = [
    {
      label: "Product",
      key: "product",
      render: (record: InventoryTransaction) => (
        <div>
          <div>{record.product?.name}</div>
          <small style={{ color: "#888" }}>{record.product?.sku}</small>
        </div>
      ),
    },
    {
      label: "Warehouse",
      key: "warehouse",
      render: (record: InventoryTransaction) => record.warehouse?.name,
    },
    {
      label: "Type",
      key: "transactionType",
      render: (record: InventoryTransaction) => {
        const color =
          record.transactionType === "IN"
            ? "green"
            : record.transactionType === "OUT"
              ? "red"
              : record.transactionType === "DAMAGE"
                ? "orange"
                : "blue";

        return <Tag color={color}>{record.transactionType}</Tag>;
      },
    },
    {
      label: "Reference",
      key: "Reference",
      render: (record: InventoryTransaction) => (
        <div>
          <div>{record.referenceType}</div>
          <small>#{record.referenceId}</small>
        </div>
      ),
    },
    {
      label: "Qty",
      key: "qty",
    },
    {
      label: "Unit Cost",
      key: "unitCost",
      render: (record: InventoryTransaction) => `$${record.unitCost}`,
    },
    {
      label: "Total",
      key: "total",
      render: (record: InventoryTransaction) =>
        `$${(Number(record.qty) * Number(record.unitCost)).toFixed(2)}`,
    },
    {
      label: "Note",
      key: "note",
      ellipsis: true,
    },
    {
      label: "Date",
      key: "createdAt",
      render: (record: InventoryTransaction) =>
        new Date(record.createdAt).toLocaleString(),
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
              { label: "ADJUSTMENT", value: "ADJUSTMENT" },
              { label: "DAMAGE", value: "DAMAGE" },
              { label: "LOSS", value: "LOSS" },
            ]}
          />
        </Col>
      </Row>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Transactions</Title>

            <DataTable
              data={transaction?.data?.data?.data ?? []}
              columns={columns}
            />
          </Card>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Col>
      </Row>
    </div>
  );
}
