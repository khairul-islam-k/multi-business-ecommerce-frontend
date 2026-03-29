"use client";

import { useMemo, useState } from "react";
import {
  Select,
  Input,
  Button,
  Table,
  Card,
  Row,
  Col,
  Typography,
  Tag,
} from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockHistory } from "./data";

const { Search } = Input;
const { Title } = Typography;

export default function BillingHistoryPage() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  // Columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tenant", dataIndex: "tenant_id", key: "tenant_id" },
    {
      title: "Subscription",
      dataIndex: "subscription_id",
      key: "subscription_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (v: number) => `$${v}`,
    },
    {
      title: "Tax",
      dataIndex: "tax_amount",
      render: (v: number) => `$${v}`,
    },
    {
      title: "Discount",
      dataIndex: "discount_amount",
      render: (v: number) => `$${v}`,
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      render: (v: number) => `$${v}`,
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      render: (status: string) => {
        const color =
          status === "paid" ? "green" : status === "pending" ? "orange" : "red";

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Paid At",
      dataIndex: "paid_at",
      render: (v: string | null) => (v ? new Date(v).toLocaleString() : "—"),
    },
    {
      title: "Invoice",
      dataIndex: "invoice_id",
      render: (v: string | null) => v || "—",
    },
  ];

  // Filtering logic
  const filteredData = useMemo(() => {
    return mockHistory.filter((item) => {
      const matchesSearch =
        item.invoice_id?.toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.tenant_id).includes(searchText);

      const matchesStatus = statusFilter
        ? item.payment_status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Billing History" breadcrumb={adminBreadcrumb} />

      {/* Controls */}
      <div className="flex gap-3">
        <Search
          placeholder="Search by tenant or invoice"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 320 }}
        />

        <Select
          placeholder="Filter by status"
          allowClear
          style={{ width: 180 }}
          onChange={(v) => setStatusFilter(v)}
          options={[
            { label: "Paid", value: "paid" },
            { label: "Pending", value: "pending" },
            { label: "Failed", value: "failed" },
          ]}
        />
      </div>

      {/* Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={5}>Billing Records</Title>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              size="small"
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
