"use client";

import Link from "next/link";
import { Alert, Button, Card } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function WebsiteMenuBuilder() {
  return (
    <div className="space-y-6">
      <PageHeader title="Website Menu Builder" breadcrumb={adminBreadcrumb} />

      <Card>
        <Alert
          type="info"
          showIcon
          message="Menu builder API is not available yet."
          description="This route is kept for the planned menu-builder workflow. Current navigation configuration is available from each website detail page."
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
