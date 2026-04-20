"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Select, Avatar } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "@/lib/axios";
import Loader from "@/components/shared/loader";
import Pagination from "@/components/shared/Pagination";
import { useSwal } from "@/hooks/use-swal";
import { queryClient } from "@/providers/query-provider";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

import ViewModal from "./_components/view-modal";

const { Option } = Select;

export default function SuppliersPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Active");

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-suppliers", currentPage, search, status],
    queryFn: async () =>
      api
        .get(
          `/business-suppliers?page=${currentPage}&limit=${pageSize}&status=${status}&search=${search}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  if (isLoading) return <Loader />;

  const handleDelete = async (uuid: string) => {
    await api.delete(`/business-suppliers/${uuid}`);

    swal.success("Supplier deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-suppliers",
    });
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "Name",
      type: "primary",
      sortable: true,
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

  const suppliers = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={suppliers}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => {
          setSearch(q);
          setCurrentPage(1);
        }}
        toolbarEnd={
          <div className="flex gap-2">
            <Select
              value={status}
              onChange={(val) => {
                setStatus(val);
                setCurrentPage(1);
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
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        supplier={selected}
      />
    </div>
  );
}
