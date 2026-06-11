"use client";

import Link from "next/link";
import { useState } from "react";
import { App, Button, Dropdown, Flex, Tag } from "antd";
import { EyeOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";

import { useSwal } from "@/hooks/use-swal";
import type { SystemUserStatus, Tenant } from "@/lib/api";
import { useTenantMutations, useTenants } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

const statusOptions: Array<{ label: string; value: SystemUserStatus }> = [
  { label: "Activate", value: "ACTIVE" },
  { label: "Deactivate", value: "INACTIVE" },
  { label: "Suspend", value: "SUSPENDED" },
];

const statusColor: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "default",
  SUSPENDED: "red",
};

export default function TenantListPage() {
  const swal = useSwal();
  const { message } = App.useApp();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const query = {
    page: currentPage,
    limit: 10,
    search,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isFetching } = useTenants(query);
  const { updateTenantStatus } = useTenantMutations();

  const columns: Column<Tenant>[] = [
    {
      key: "name",
      label: "Tenant",
      type: "primary",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      key: "ownedBusinesses",
      label: "Businesses",
      render: (row) => row._count?.ownedBusinesses ?? 0,
    },
    {
      key: "tenantUsers",
      label: "Users",
      render: (row) => row._count?.tenantUsers ?? 0,
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={statusColor[row.status ?? ""] ?? "default"}>
          {row.status ?? "ACTIVE"}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
  ];

  const handleStatusChange = (
    tenant: Tenant,
    status: SystemUserStatus,
  ) => {
    if (tenant.status === status) return;

    swal.modal.confirm({
      title: "Update tenant status?",
      content: `Set ${tenant.name}'s account status to ${status}?`,
      okText: "Update status",
      cancelText: "Cancel",
      okButtonProps: {
        danger: status !== "ACTIVE",
      },
      async onOk() {
        try {
          await updateTenantStatus.mutateAsync({
            tenantId: tenant.id,
            payload: { status },
          });

          message.success("Tenant status updated successfully.");
        } catch (error) {
          message.error(getApiErrorMessage(error));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenants"
        subtitle="Manage tenant accounts, statuses, and ownership activity across the platform."
        breadcrumb={superAdminBreadcrumb}
      />

      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={isLoading || isFetching || updateTenantStatus.isPending}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <Link href="/super-admin/dashboard/tenants/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Tenant
            </Button>
          </Link>
        }
        actions={(row) => (
          <Flex gap={16}>
            <Link href={`/super-admin/dashboard/tenants/${row.id}`}>
              <Button icon={<EyeOutlined />} />
            </Link>

            <Dropdown
              menu={{
                items: statusOptions.map((option) => ({
                  key: option.value,
                  label: option.label,
                  disabled: row.status === option.value,
                  onClick: () => handleStatusChange(row, option.value),
                })),
              }}
            >
              <Button
                type="text"
                aria-label="Tenant actions"
                icon={<MoreOutlined />}
              />
            </Dropdown>
          </Flex>
        )}
        pagination={{
          currentPage,
          totalPages: data?.meta.totalPages ?? 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
