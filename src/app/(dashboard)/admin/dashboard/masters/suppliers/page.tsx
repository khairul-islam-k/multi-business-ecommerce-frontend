"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import Loader from "@/components/shared/loader";
import ViewModal from "./_components/view-modal";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

const { Option } = Select;

export default function SuppliersPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-suppliers", currentPage, search, status],
    queryFn: async () => {
      const res = await api.get("/business-suppliers", {
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
    await api.delete(`/business-suppliers/${uuid}`);

    swal.success("Supplier deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-suppliers",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
    },
    {
      key: "code",
      label: "Code",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "contact_person",
      label: "Contact Person",
    },
    {
      key: "city",
      label: "City",
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

  const suppliers = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={suppliers}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
        }}
        toolbarEnd={
          <div className="flex gap-2">
            <Select
              value={status}
              onChange={(val) => {
                setStatus(val);
              }}
              className="w-32"
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>

            <Link href="/admin/dashboard/masters/suppliers/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Supplier
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
                router.push(
                  `/admin/dashboard/masters/suppliers/edit/${row.uuid}`,
                )
              }
            />

            <Popconfirm
              title="Delete supplier?"
              description="This action cannot be undone"
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
        supplier={selected}
      />
    </div>
  );
}
