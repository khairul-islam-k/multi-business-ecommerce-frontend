"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, message, Popconfirm, Space, Avatar, Badge } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";

import ViewModal from "./_components/view-modal";
import { Column, DataTable } from "@/components/shared/data-table";
import { useSwal } from "@/hooks/use-swal";

export default function CategoriesPage() {
  const router = useRouter();
  const swal = useSwal();

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-categories"],
    queryFn: async () => api.get("/categories").then((res) => res.data),
  });

  if (isLoading) return <Loader />;

  const categories = data?.data ?? [];

  const handleDelete = async (uuid: string) => {
    await api.delete(`/categories/${uuid}`);
    swal.success("Category deleted successfully.");
    queryClient.invalidateQueries({ queryKey: ["fetch-categories"] });
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

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={categories}
        columns={columns}
        loading={isLoading}
        searchKeys={["name", "slug", "status"]}
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

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        category={selected}
      />
    </div>
  );
}
