"use client";

import {
  CirclePlus,
  Download
} from "lucide-react";


import Link from "next/link";
import { Button } from "antd";

import { mockStats } from "./data";
import StatCard from "@/components/shared/stat-card";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function InvoiceList() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" breadcrumb={adminBreadcrumb} />

      <div className="flex items-center justify-end gap-3">
        <Button icon={<Download />}>Export</Button>

        <Link href="/admin/dashboard/invoices/create">
          <Button type="primary" icon={<CirclePlus />}>
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

      table

    </div>
  );
}
