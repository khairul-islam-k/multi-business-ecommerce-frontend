"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Avatar, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

import ViewModal from "./_components/view-modal";

const { Option } = Select;

export default function BrandsPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-brands", currentPage, search, status],
    queryFn: async () => {
      const res = await api.get("/brands", {
        params: {
          page: currentPage,
          limit: pageSize,
          status,
          search,
          sortBy: "createdAt",
          sortOrder: "DESC",
        },
      });

      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  if (isLoading && !data) return <Loader />;

  const handleDelete = async (uuid: string) => {
    await api.delete(`/brands/${uuid}`);
    swal.success("Brand deleted successfully.");
    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-brands",
    });
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
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const brands = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Brands" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={brands}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
        }}
        toolbarEnd={
          <div className="flex gap-2">
            <Select
              className="border rounded px-2"
              value={status}
              onChange={(e) => {
                setStatus(e);
              }}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
            <Link href="/admin/dashboard/masters/brands/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Brand
              </Button>
            </Link>
          </div>
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
        pagination={{
          currentPage,
          onPageChange: setCurrentPage,
          totalPages,
        }}
      />

      <ViewModal open={open} onClose={() => setOpen(false)} brand={selected} />
    </div>
  );
}
