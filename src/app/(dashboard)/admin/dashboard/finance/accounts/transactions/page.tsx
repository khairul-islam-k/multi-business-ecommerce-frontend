"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Table, Typography, Input, Select, Row, Col, Badge } from "antd";

import { mockTransactions } from "./data";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text } = Typography;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusColors: Record<string, any> = {
  Completed: "success",
  Pending: "warning",
};

export default function TransactionsList() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.account.toLowerCase().includes(search.toLowerCase());

      const matchType =
        typeFilter === "all" || t.type.toLowerCase() === typeFilter;

      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) => (
        <Link
          href={`/admin/dashboard/finance/accounts/transactions/${record.id}`}
          className="font-mono text-sm"
        >
          {record.id}
        </Link>
      ),
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Text type={type === "Credit" ? "success" : "danger"}>{type}</Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-mono">
          {val ? `$${val.toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-mono">
          {val ? `$${val.toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (val: string) => (
        <Text type="secondary">{new Date(val).toLocaleDateString()}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge status={statusColors[status] || "default"} text={status} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" breadcrumb={adminBreadcrumb} />

      {/* Toolbar */}
      <Row gutter={[12, 12]}>
        <Col lg={12} xs={24}>
          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 160 }}
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </Select>
        </Col>
      </Row>

      {/* Table */}
      <Card style={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No transactions found." }}
        />
      </Card>
    </div>
  );
}
