"use client";

import { Button, Card } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function CreatePermission() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Create Permission" breadcrumb={adminBreadcrumb} />

      <Card>
        <p className="mb-4 text-sm text-gray-500">
          Permissions are defined by the backend enum catalog. Create or edit a
          role to assign permissions to that role.
        </p>
        <Button
          type="primary"
          onClick={() => router.push("/admin/dashboard/access-control/roles")}
        >
          Go to Roles
        </Button>
      </Card>
    </div>
  );
}
