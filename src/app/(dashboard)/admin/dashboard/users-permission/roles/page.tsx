"use client";

import { useState } from "react";
import { Card, Button, Empty } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import Link from "next/link";
import { queryClient } from "@/providers/query-provider";
import { useSwal } from "@/hooks/use-swal";

export default function RolesPage() {
  const router = useRouter();
  const swal = useSwal();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["roles", search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (currentPage) params.append("page", String(currentPage));

      const res = await api.get(`/roles?${params.toString()}`);
      return res.data?.data;
    },
  });

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
      render: (r) => r.name,
    },
    {
      key: "slug",
      label: "Slug",
      render: (r) => r.slug,
    },
    {
      key: "description",
      label: "Description",
      render: (r) => r.description || "—",
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (r) => r.permissions?.length || 0,
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/dashboard/users-permission/roles/edit/${row.uuid}`}
          >
            <Button type="text" icon={<EditOutlined />} />
          </Link>
          <Button
            onClick={async () => {
              const { isConfirmed } = await swal.confirm({
                title: "Confirm Deletion",
                text: "Are you sure you want to delete this role?",
              });
              if (isConfirmed) {
                await api.delete(`/roles/${row.uuid}`);
                queryClient.invalidateQueries({ queryKey: ["roles"] });
                swal.success("Deleted successfully");
              }
            }}
            color="red"
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" breadcrumb={adminBreadcrumb} />

      <Card
        title={`Roles (${data?.data?.length || 0})`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              router.push("/admin/dashboard/users-permission/roles/create")
            }
          >
            Create Role
          </Button>
        }
      >
        {isError ? (
          <Empty description="Failed to load roles" />
        ) : (
          <DataTable
            data={data?.data || []}
            columns={columns}
            onSearch={(q) => {
              setSearch(q);
            }}
            loading={isLoading || isFetching}
            pagination={{
              currentPage,
              onPageChange: setCurrentPage,
              totalPages: data?.meta?.totalPages || 1,
            }}
          />
        )}
      </Card>
    </div>
  );
}
