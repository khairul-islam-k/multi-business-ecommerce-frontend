"use client";

import { Badge, Table, Typography } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { mockLedgers } from "./data";

const { Link } = Typography;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (_: any, r: any) => <Link>{r.name}</Link>,
  },
  { title: "Type", dataIndex: "type" },
  {
    title: "Status",
    dataIndex: "status",
    render: (_: any, r: any) =>
      r.status === "Active" ? (
        <Badge status="success" text={r.status} />
      ) : (
        <Badge status="error" text={r.status} />
      ),
  },
  { title: "Entry", dataIndex: "entry" },
];

export default function LadgersPage() {
  <div className="space-y-6">
    <PageHeader title="Ledgers" breadcrumb={adminBreadcrumb} />

    <div className="w-full">
      <Table columns={columns} dataSource={mockLedgers} />
    </div>
  </div>;
}
