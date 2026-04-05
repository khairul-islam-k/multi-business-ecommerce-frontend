"use client";

import PageHeader from "@/components/shared/page-header";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button, Tag } from "antd";
import { mockTransactions, SmsCreditTransaction } from "./data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Link from "next/link";

const columns: Column<SmsCreditTransaction>[] = [
  {
    key: "created_at",
    label: "Date",
    sortable: true,
    render: (r) => new Date(r.created_at).toLocaleDateString(),
  },
  {
    key: "transaction_type",
    label: "Type",
    sortable: true,
    filterOptions: ["credit", "debit"],
    render: (r) => (
      <Tag color={r.transaction_type === "credit" ? "green" : "red"}>
        {r.transaction_type.toUpperCase()}
      </Tag>
    ),
  },
  {
    key: "credits",
    label: "Credits",
    sortable: true,
    render: (r) => (
      <span
        className={
          r.transaction_type === "credit"
            ? "text-green-500 font-medium"
            : "text-red-500 font-medium"
        }
      >
        {r.transaction_type === "credit" ? "+" : "-"}
        {r.credits}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    render: (r) => (r.amount ? `$${r.amount}` : "—"),
  },
  { key: "note", label: "Note" },
];

export default function SmsUsageLogs() {
  return (
    <div className="space-y-6">
      <PageHeader title="SMS Usage Logs" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockTransactions}
        columns={columns}
        searchKeys={["note"]}
        toolbarEnd={
          <Link href="/admin/dashboard/sms/credits/recharge">
            <Button type="primary">Buy More Credits</Button>
          </Link>
        }
      />
    </div>
  );
}
