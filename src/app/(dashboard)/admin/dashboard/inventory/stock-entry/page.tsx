"use client";

import Link from "next/link";
import { Alert, Button, Card } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function StockEntryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Stock Entry" breadcrumb={adminBreadcrumb} />

      <Card>
        <Alert
          type="info"
          showIcon
          message="Stock entry API is not available yet."
          description="This route is kept for the planned stock-entry workflow. The current API supports stock adjustments for controlled inventory corrections."
        />

        <div className="mt-4">
          <Link href="/admin/dashboard/inventory/stock-adjustments/create">
            <Button type="primary">Create stock adjustment</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
