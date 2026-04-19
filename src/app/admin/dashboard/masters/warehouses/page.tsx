"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, message, Popconfirm, Space, Badge } from "antd";
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

export default function WarehousesPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["fetch-warehouses"],
    queryFn: async () => api.get("/warehouse").then((res) => res.data),
  });

  if (isLoading) return <Loader />;

  const warehouses = data?.data ?? [];

  const handleDelete = async (uuid: string) => {
    await api.delete(`/warehouse/${uuid}`);
    message.success("Warehouse deleted successfully.");
    queryClient.invalidateQueries({ queryKey: ["fetch-warehouses"] });
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

  return (
    <div className="space-y-6">
      <PageHeader title="Warehouses" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={warehouses}
        columns={columns}
        loading={isLoading}
        searchKeys={["name", "city", "district", "phone", "type", "status"]}
        toolbarEnd={
          <Link href="/admin/dashboard/masters/warehouses/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Warehouse
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
      />

      <ViewModal
        open={open}
        onClose={() => setOpen(false)}
        warehouse={selected}
      />
    </div>
  );
}
