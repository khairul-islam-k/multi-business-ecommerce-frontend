"use client";

import { useState } from "react";
import { Card, Button, Empty, Tag } from "antd";
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

export default function PermissionsPage() {
  const router = useRouter();
  const swal = useSwal();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["permissions", search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", String(currentPage));

      const res = await api.get(`/permissions?${params.toString()}`);
      return res.data?.data;
    },
  });

  const columns: Column<any>[] = [
    {
      key: "module_key",
      label: "Module",
      render: (r) => <Tag>{r.module_key}</Tag>,
    },
    {
      key: "feature_key",
      label: "Feature",
      render: (r) => <Tag color="blue">{r.feature_key}</Tag>,
    },
    {
      key: "action_key",
      label: "Action",
      render: (r) => <Tag color="green">{r.action_key}</Tag>,
    },
    {
      key: "label",
      label: "Label",
      type: "primary",
      render: (r) => r.label,
    },
    {
      key: "description",
      label: "Description",
      render: (r) => r.description || "—",
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/dashboard/users-permission/permission/edit/${row.uuid}`}
          >
            <Button type="text" icon={<EditOutlined />} />
          </Link>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              const { isConfirmed } = await swal.confirm({
                title: "Confirm Deletion",
                text: "Delete this permission?",
              });

              if (isConfirmed) {
                await api.delete(`/permissions/${row.uuid}`);
                queryClient.invalidateQueries({ queryKey: ["permissions"] });
                swal.success("Deleted successfully");
              }
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Permissions" breadcrumb={adminBreadcrumb} />

      <Card
        title={`Permissions (${data?.data?.length || 0})`}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              router.push("/admin/dashboard/users-permission/permission/create")
            }
          >
            Create Permission
          </Button>
        }
      >
        {isError ? (
          <Empty description="Failed to load permissions" />
        ) : (
          <DataTable
            data={data?.data || []}
            columns={columns}
            loading={isLoading || isFetching}
            onSearch={(q) => {
              setSearch(q);
              setCurrentPage(1);
            }}
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
