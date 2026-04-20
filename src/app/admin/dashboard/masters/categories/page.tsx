"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Avatar, Badge } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/Pagination";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

import ViewModal from "./_components/view-modal";

export default function CategoriesPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-categories", currentPage, search],
    queryFn: async () =>
      api
        .get(
          `/categories?page=${currentPage}&limit=${pageSize}&search=${search}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  if (isLoading) return <Loader />;

  const handleDelete = async (uuid: string) => {
    await api.delete(`/categories/${uuid}`);
    swal.success("Category deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-categories",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "image_url",
      label: "Image",
      render: (r) => <Avatar src={r.image_url} />,
    },
    {
      key: "name",
      label: "Name",
      type: "primary",
      sortable: true,
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "parent_id",
      label: "Parent",
      render: (r) => r.parent_id ?? "—",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterOptions: ["Active", "Inactive"],
      render: (r) => (
        <Badge
          status={r.status === "Active" ? "success" : "default"}
          text={r.status}
        />
      ),
    },
  ];

  const categories = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 0;

  console.log(data, categories);

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={categories}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <Link href="/admin/dashboard/masters/categories/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Category
            </Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelected(row);
                setOpen(true);
              }}
            />

            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/masters/categories/edit/${row.uuid}`,
                )
              }
            />

            <Popconfirm
              title="Delete category?"
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

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        category={selected}
      />
    </div>
  );
}
