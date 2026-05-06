"use client";

import Link from "next/link";
import { useState } from "react";
import { useSwal } from "@/hooks/use-swal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Badge, Space, Popconfirm, Select } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import api from "@/lib/axios";
import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { queryClient } from "@/providers/query-provider";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusColors: Record<string, any> = {
  Pending: "processing",
  Processing: "processing",
  Delivered: "success",
  Cancelled: "error",
  Returned: "warning",
};

export default function OrdersList() {
  const swal = useSwal();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["fetch-orders", currentPage, search, status],
    queryFn: async () => {
      const res = await api.get("/orders", {
        params: {
          page: currentPage,
          limit: pageSize,
          order_status: status,
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

  const orders = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;

  const handleDelete = async (uuid: string) => {
    await api.delete(`/orders/${uuid}`);
    swal.success("Addon deleted successfully.");

    queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === "fetch-orders",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      key: "order_no",
      label: "Order",
      type: "primary",
      render: (r) => (
        <Link
          href={`/admin/dashboard/orders/${r.uuid}`}
          className={`font-semibold`}
        >
          {r.order_no}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (r) => r.customer?.name ?? "-",
    },
    {
      key: "order_status",
      label: "Status",
      render: (r) => (
        <Badge status={statusColors[r.order_status]} text={r.order_status} />
      ),
    },
    {
      key: "source_channel",
      label: "Channel",
      render: (v) => v.source_channel ?? "-",
    },
    {
      key: "total_amount",
      label: "Total",
      render: (v) => (
        <span className="font-mono">${Number(v.total_amount).toFixed(2)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (v) => new Date(v.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={orders}
        columns={columns}
        loading={isFetching}
        onSearch={(q) => setSearch(q)}
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/dashboard/orders/${row.uuid}`)}
            />
            <Popconfirm
              title="Delete addon?"
              description="This action cannot be undone"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(row.uuid)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )}
        toolbarEnd={
          <div className="flex gap-2">
            <Select
              className="border rounded px-2"
              value={status}
              onChange={(e) => {
                setStatus(e);
                setCurrentPage(1);
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Select>

            <Link href="/admin/dashboard/orders/create">
              <Button type="primary" icon={<PlusOutlined />}>
                New Order
              </Button>
            </Link>
          </div>
        }
        pagination={{
          currentPage,
          onPageChange: setCurrentPage,
          totalPages,
        }}
      />
    </div>
  );
}
