"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/Pagination";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

export default function AddonsPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-addons", currentPage, search],
    queryFn: async () =>
      api
        .get(
          `/addons?page=${currentPage}&limit=${pageSize}&search=${search}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  if (isLoading) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (r) => r.type ?? "-",
    },
    {
      key: "limit_key",
      label: "Limit Key",
      render: (r) => <span className="font-mono text-xs">{r.limit_key}</span>,
    },
    {
      key: "unit_price",
      label: "Unit Price",
      sortable: true,
      render: (r) => `$${r.unit_price}`,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterOptions: ["Active", "Inactive"],
      render: (r) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            r.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const handleDelete = async (uuid: string) => {
    await api.delete(`/addons/${uuid}`);
    swal.success("Addon deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-addons",
    });
  };

  const addons = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Addons" breadcrumb={superAdminBreadcrumb} />

      <DataTable
        data={addons}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <Link href="/super-admin/dashboard/addons/create">
            <Button type="primary">Create Addon</Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/super-admin/dashboard/addons/edit/${row.uuid}`)
              }
            />

            <Popconfirm
              title="Delete addon?"
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
