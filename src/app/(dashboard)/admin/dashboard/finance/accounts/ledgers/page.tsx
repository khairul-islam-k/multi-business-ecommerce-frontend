"use client";

import Link from "next/link";
import { Badge, Col, Select, Table, Input, Row } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockLedgers } from "./data";

const { Search } = Input;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => (
      <Link href={`/admin/dashboard/finance/accounts/ledgers/${r.id}`}>
        {r.name}
      </Link>
    ),
  },
  { title: "Type", dataIndex: "type" },
  {
    title: "Status",
    dataIndex: "status",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) =>
      r.status === "Active" ? (
        <Badge status="success" text={r.status} />
      ) : (
        <Badge status="error" text={r.status} />
      ),
  },
  { title: "Entries", dataIndex: "entries" },
];

export default function LadgersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Ledgers" breadcrumb={adminBreadcrumb} />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Search placeholder="Search Ledger" />
        </Col>
        <Col xs={24} lg={6} style={{ width: "100%" }}>
          <Select defaultValue="Filter Ledgers">
            <Select.Option>Active</Select.Option>
            <Select.Option>Inactive</Select.Option>
          </Select>
        </Col>
      </Row>

      <div className="w-full">
        <Table columns={columns} dataSource={mockLedgers} />
      </div>
    </div>
  );
}
