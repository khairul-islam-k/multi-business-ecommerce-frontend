"use client";

import { Button, Card } from "antd";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function EditPermission() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Permission" breadcrumb={adminBreadcrumb} />

      <Card>
        <p className="mb-4 text-sm text-gray-500">
          The current backend exposes permissions as a fixed catalog and through
          role assignment endpoints. Edit a role to change its permissions.
        </p>
        <Button
          type="primary"
          onClick={() => router.push("/admin/dashboard/users-permissions/roles")}
        >
          Go to Roles
        </Button>
      </Card>
    </div>
  );
}
