"use client";

import Link from "next/link";
import { Alert, Button, Card } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function PageBuilder() {
  return (
    <div className="space-y-6">
      <PageHeader title="Page Builder" breadcrumb={adminBreadcrumb} />

      <Card>
        <Alert
          type="info"
          showIcon
          message="Page builder API is not available yet."
          description="This route is kept for the planned page-builder workflow. Current website configuration is available from the Websites section."
        />

        <div className="mt-4">
          <Link href="/admin/dashboard/website-builder/websites">
            <Button type="primary">Go to websites</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
