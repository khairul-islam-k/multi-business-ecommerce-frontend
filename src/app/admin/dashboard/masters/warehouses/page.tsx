"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Badge, Select } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
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

export default function WarehousesPage() {
  const router = useRouter();
  const swal = useSwal();

  const pageSize = 10;

  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-warehouses", currentPage, search, status],
    queryFn: async () =>
      api
        .get(
          `/warehouse?page=${currentPage}&limit=${pageSize}&status=${status}&search=${search}&sortBy=createdAt&sortOrder=DESC`,
        )
        .then((res) => res.data),
  });

  if (isLoading) return <Loader />;

  const handleDelete = async (uuid: string) => {
    await api.delete(`/warehouse/${uuid}`);
    swal.success("Warehouse deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-warehouses",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      render: (r) => r.code ?? "-",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "city",
      label: "City",
    },
    {
      key: "district",
      label: "District",
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      filterOptions: ["Regional", "Temporary", "Central"],
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

  const warehouses = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Warehouses" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={warehouses}
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
            <Link href="/admin/dashboard/masters/warehouses/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Warehouse
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
                  `/admin/dashboard/masters/warehouses/edit/${row.uuid}`,
                )
              }
            />

            <Popconfirm
              title="Delete warehouse?"
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

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        warehouse={selected}
      />
    </div>
  );
}
