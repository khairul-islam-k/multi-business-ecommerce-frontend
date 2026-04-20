"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/Pagination";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

export default function TenantListPage() {
  const swal = useSwal();
  const router = useRouter();

  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-tenants", currentPage, search],
    queryFn: async () =>
      api
        .get(
          `/auth-tenant?page=${currentPage}&limit=${pageSize}&search=${search}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  if (isLoading) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "business_name",
      label: "Business",
      type: "primary",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterOptions: ["Active", "Inactive", "Suspended"],
      render: (r: any) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            r.status === "Active"
              ? "bg-green-100 text-green-700"
              : r.status === "Suspended"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "email",
      label: "Email",
      render: (r) => r.email ?? "—",
    },
    {
      key: "owner_name",
      label: "Owner",
      render: (r) => r.owner?.name ?? "—",
    },
    {
      key: "currency",
      label: "Currency",
      render: (r) => r.currency ?? "—",
    },
    {
      key: "timezone",
      label: "Timezone",
      render: (r) => r.timezone ?? "—",
    },
    {
      key: "trial_ends_at",
      label: "Trial Ends",
      render: (r) =>
        r.trial_ends_at ? new Date(r.trial_ends_at).toLocaleDateString() : "—",
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const handleDelete = async (uuid: string) => {
    await api.delete(`/auth-tenant/${uuid}`);
    swal.success("Tenant deleted successfully.");
    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-tenants",
    });
  };

  const tenants = data.data.data;
  const totalPages = data.data.meta.totalPages || 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Tenants" breadcrumb={superAdminBreadcrumb} />

      <DataTable
        data={tenants || []}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <Link href="/super-admin/dashboard/tenants/create">
            <Button type="primary">Create Tenant</Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/super-admin/dashboard/tenants/${row.uuid}`)
              }
            />
            <Popconfirm
              title="Delete tenant?"
              description="This action cannot be undone"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(row.uuid)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
