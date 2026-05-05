"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Popconfirm, Space, Tag } from "antd";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/pagination";
import { queryClient } from "@/providers/query-provider";
import { Column, DataTable } from "@/components/shared/data-table";

export default function PackagesPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-packages", currentPage, search],
    queryFn: async () =>
      api
        .get(
          `/packages?page=${currentPage}&limit=${pageSize}&search=${search}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  if (isLoading) return <Loader />;

  const handleDelete = async (id: string) => {
    await api.delete(`/packages/${id}`);
    swal.success("Package deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-packages",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Package",
      type: "primary",
    },
    {
      key: "monthly_price",
      label: "Monthly",
      render: (r) => `$${r.monthly_price}`,
    },
    {
      key: "yearly_price",
      label: "Yearly",
      render: (r) => `$${r.yearly_price}`,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <Tag color={r.status === "Active" ? "green" : "red"}>{r.status}</Tag>
      ),
    },
    {
      key: "subscribers",
      label: "Subscribers",
      render: (r) => r.subscribers ?? 0,
    },
  ];

  const packages = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 0;

  return (
    <div className="space-y-6">
      <DataTable
        data={packages}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <Link href="/super-admin/dashboard/packages/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Create Package
            </Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/super-admin/dashboard/packages/edit/${row.uuid}`)
              }
            />

            <Popconfirm
              title="Delete package?"
              description="This action cannot be undone"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(row.uuid)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
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
