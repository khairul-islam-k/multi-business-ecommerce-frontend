"use client";

import { Card, Empty, Tag } from "antd";

import type { PermissionItem } from "@/lib/api";
import { useAvailablePermissions } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

export default function PermissionsPage() {
  const {
    data = [],
    isLoading,
    isError,
    isFetching,
  } = useAvailablePermissions();

  const columns: Column<PermissionItem>[] = [
    {
      key: "feature",
      label: "Feature",
      type: "primary",
      render: (row) => <Tag color="blue">{row.feature}</Tag>,
    },
    {
      key: "action",
      label: "Action",
      render: (row) => <Tag color="green">{row.action}</Tag>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permissions"
        subtitle="Permission definitions come from the backend permission catalog. Assign them from role create or edit."
        breadcrumb={adminBreadcrumb}
      />

      <Card title={`Available Permissions (${data.length})`}>
        {isError ? (
          <Empty description="Failed to load permissions" />
        ) : (
          <DataTable
            data={data}
            columns={columns}
            loading={isLoading || isFetching}
          />
        )}
      </Card>
    </div>
  );
}
