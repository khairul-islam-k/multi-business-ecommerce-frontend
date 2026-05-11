"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Popconfirm, Space, Tag } from "antd";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { useSwal } from "@/hooks/use-swal";
import type { Business } from "@/lib/api";
import { useBusinesses, useBusinessMutations } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

export default function TenantListPage() {
  const swal = useSwal();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const query = {
    page: currentPage,
    limit: 10,
    search,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isFetching } = useBusinesses(query);
  const { removeBusiness } = useBusinessMutations();

  const columns: Column<Business>[] = [
    {
      key: "name",
      label: "Business",
      type: "primary",
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => row.slug || "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "blue"}>
          {row.status ?? "TRIAL"}
        </Tag>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row.email || "-",
    },
    {
      key: "owner",
      label: "Owner",
      render: (row) => row.ownerUser?.name ?? `User #${row.ownerUserId ?? "-"}`,
    },
    {
      key: "currencyCode",
      label: "Currency",
      render: (row) => row.currencyCode || "-",
    },
    {
      key: "timezone",
      label: "Timezone",
      render: (row) => row.timezone || "-",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
  ];

  const handleDelete = async (businessId: string) => {
    try {
      await removeBusiness.mutateAsync(businessId);
      swal.success("Business deleted successfully.");
    } catch {
      swal.error("Failed to delete business.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Businesses"
        subtitle="Live businesses from the backend API."
        breadcrumb={superAdminBreadcrumb}
      />

      <DataTable
        data={data?.items ?? []}
        columns={columns}
        loading={isLoading || isFetching || removeBusiness.isPending}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <Link href="/super-admin/dashboard/tenants/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Business
            </Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              aria-label="View business"
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/super-admin/dashboard/tenants/${row.id}`)
              }
            />
            <Popconfirm
              title="Delete business?"
              description="This will deactivate and soft-delete the business."
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => handleDelete(row.id)}
            >
              <Button
                type="text"
                danger
                aria-label="Delete business"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
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
