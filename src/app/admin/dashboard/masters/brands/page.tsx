"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, message, Popconfirm, Space, Avatar } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";

import { Column, DataTable } from "@/components/shared/data-table";

import ViewModal from "./_components/view-modal";
import { useSwal } from "@/hooks/use-swal";

export default function BrandsPage() {
  const router = useRouter();
  const swal = useSwal();

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-brands"],
    queryFn: async () => api.get("/brands").then((res) => res.data),
  });

  if (isLoading) return <Loader />;

  const brands = data?.data ?? [];

  const handleDelete = async (uuid: string) => {
    await api.delete(`/brands/${uuid}`);
    swal.success("Brand deleted successfully.");
    queryClient.invalidateQueries({ queryKey: ["fetch-brands"] });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "logo",
      label: "Logo",
      render: (r) => <Avatar src={r.logo} />,
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
      key: "description",
      label: "Description",
      render: (r) => (
        <span className="text-xs text-gray-500 line-clamp-1">
          {r.description ?? "-"}
        </span>
      ),
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
              : "bg-gray-100 text-gray-600"
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

  return (
    <div className="space-y-6">
      <PageHeader title="Brands" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={brands}
        columns={columns}
        loading={isLoading}
        searchKeys={["name", "slug", "status", "description"]}
        toolbarEnd={
          <Link href="/admin/dashboard/masters/brands/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Brand
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
                router.push(`/admin/dashboard/masters/brands/edit/${row.uuid}`)
              }
            />

            <Popconfirm
              title="Delete brand?"
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

      <ViewModal open={open} onClose={() => setOpen(false)} brand={selected} />
    </div>
  );
}
