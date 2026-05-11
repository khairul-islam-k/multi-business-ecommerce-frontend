"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Empty, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import { useSwal } from "@/hooks/use-swal";
import type { Role } from "@/lib/api";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import { useRoleMutations, useRoles } from "@/lib/api";

export default function RolesPage() {
  const router = useRouter();
  const swal = useSwal();
  const businessId = useActiveBusinessId();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rolesQuery = useRoles(businessId ?? undefined, {
    search,
    page: currentPage,
    limit: 10,
  });
  const { removeRole } = useRoleMutations(businessId ?? 0);

  const columns: Column<Role>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
    },
    {
      key: "description",
      label: "Description",
      render: (row) => row.description || "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
          {row.status ?? "ACTIVE"}
        </Tag>
      ),
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (row) => row.permissions?.length ?? 0,
    },
  ];

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        subtitle="Roles are scoped to the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={rolesQuery.data?.items ?? []}
          columns={columns}
          onSearch={(q) => {
            setSearch(q);
            setCurrentPage(1);
          }}
          loading={
            rolesQuery.isLoading ||
            rolesQuery.isFetching ||
            removeRole.isPending
          }
          toolbarEnd={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push("/admin/dashboard/access-control/roles/create")
              }
            >
              Create Role
            </Button>
          }
          actions={(row) => (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/dashboard/access-control/roles/edit/${row.id}`}
              >
                <Button type="text" icon={<EditOutlined />} />
              </Link>
              <Popconfirm
                title="Delete role?"
                onConfirm={async () => {
                  try {
                    await removeRole.mutateAsync(row.id);
                    swal.success("Deleted successfully.");
                  } catch {
                    swal.error("Failed to delete role.");
                  }
                }}
              >
                <Button danger type="text" icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          )}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages: rolesQuery.data?.meta.totalPages || 1,
          }}
        />
      </Card>
    </div>
  );
}
