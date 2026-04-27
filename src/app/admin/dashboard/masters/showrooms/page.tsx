"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Select } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import Loader from "@/components/shared/loader";
import { useSwal } from "@/hooks/use-swal";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

import ViewModal from "./_components/view-modal";

const { Option } = Select;

export default function ShowroomsPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-showrooms", currentPage, search, status],
    queryFn: async () =>
      api
        .get(
          `/business-showrooms?page=${currentPage}&limit=${pageSize}&search=${search}&status=${status}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
  });

  if (isLoading) return <Loader />;

  const handleDelete = async (uuid: string) => {
    await api.delete(`/business-showrooms/${uuid}`);

    swal.success("Showroom deleted");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-showrooms",
    });
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
    },
    { key: "code", label: "Code" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "district", label: "District" },
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

  const showrooms = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Showrooms" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={showrooms}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
        }}
        toolbarEnd={
          <div className="flex gap-2">
            <Select
              value={status}
              onChange={(v) => {
                setStatus(v);
              }}
              className="w-32"
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push("/admin/dashboard/masters/showrooms/create")
              }
            >
              Add Showroom
            </Button>
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
                router.push(
                  `/admin/dashboard/masters/showrooms/edit/${row.uuid}`,
                )
              }
            />

            <Popconfirm
              title="Delete showroom?"
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

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        showroom={selected}
      />
    </div>
  );
}
