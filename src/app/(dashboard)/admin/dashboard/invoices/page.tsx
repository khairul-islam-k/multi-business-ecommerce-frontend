"use client";

import Link from "next/link";
import { Button } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";

import { mockStats } from "./data";
import { mockInvoices } from "./data";
import StatusBadge from "./_components/badge";
import DataTable from "./_components/data-model";
import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function InvoiceList() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-3">
        <Button icon={<DownloadOutlined />}>Export</Button>

        <Link href="/admin/dashboard/invoices/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mockStats.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>

      <DataTable
        data={mockInvoices}
        columns={[
          {
            header: "Invoice #",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            accessor: (r: any) => (
              <Link href={`/admin/dashboard/invoices/${r.id}`}>
                <span className="cursor-pointer">{r.invoiceNo}</span>
              </Link>
            ),
          },
          { header: "Customer", dataIndex: "customer" },
          { header: "Amount", dataIndex: "amount", className: "text-right" },
          { header: "Issue Date", dataIndex: "issueDate" },
          { header: "Due Date", dataIndex: "dueDate" },
          {
            header: "Status",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            accessor: (r: any) => (
              <StatusBadge status={r.status} text={r.status.toUpperCase()} />
            ),
          },
          {
            header: "",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            accessor: (r: any) => (
              <div className="flex gap-2">
                <Link href={`/admin/dashboard/invoices/preview/${r.id}`}>
                  <Button size="small">Preview</Button>
                </Link>
                <Link href={`/admin/dashboard/invoices/preview/${r.id}`}>
                  <Button size="small">PDF</Button>
                </Link>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
