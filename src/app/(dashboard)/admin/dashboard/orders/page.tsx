"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Select, Space, Tag } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useOrdersQuery } from "@/lib/api";
import type { OrderResponse, OrderStatus } from "@/lib/api";

const statusColor: Record<OrderStatus, string> = {
  CANCELLED: "red",
  CONFIRMED: "cyan",
  DELIVERED: "green",
  PENDING: "blue",
  PROCESSING: "purple",
  RETURNED: "orange",
  SHIPPED: "geekblue",
};

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

export default function OrdersList() {
  const businessId = useActiveBusinessId();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const query = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      search,
      status,
      sortOrder: "desc" as const,
    }),
    [currentPage, search, status],
  );

  const orders = useOrdersQuery(businessId ?? "", query);

  if (!businessId) return <Loader label="No active business selected" />;
  if (orders.isLoading && !orders.data)
    return <Loader label="Loading orders" />;

  const columns: Column<OrderResponse>[] = [
    {
      key: "orderNo",
      label: "Order",
      type: "primary",
      render: (order) => (
        <Link
          href={`/admin/dashboard/orders/${order.id}`}
          className="font-semibold"
        >
          {order.orderNo ?? order.id}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) =>
        order.customerName ??
        (order.customer && typeof order.customer === "object"
          ? String((order.customer as { name?: unknown }).name ?? "-")
          : "-"),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (order) =>
        order.status ? (
          <Tag color={statusColor[order.status]}>{order.status}</Tag>
        ) : (
          "-"
        ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (order) => order.paymentStatus ?? "-",
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (order) => money(order.totalAmount),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (order) =>
        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={orders.data?.items ?? []}
        columns={columns}
        loading={orders.isFetching}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        extra={
          <Select
            allowClear
            placeholder="Status"
            value={status}
            style={{ width: 160 }}
            onChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
            }}
            options={[
              "PENDING",
              "CONFIRMED",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
              "RETURNED",
            ].map((item) => ({ label: item, value: item }))}
          />
        }
        actions={(order) => (
          <Space>
            <Link href={`/admin/dashboard/orders/${order.id}`}>
              <Button type="text" icon={<EyeOutlined />} />
            </Link>
          </Space>
        )}
        toolbarEnd={
          <Link href="/admin/dashboard/orders/create">
            <Button type="primary" icon={<PlusOutlined />}>
              New Order
            </Button>
          </Link>
        }
        pagination={{
          currentPage,
          onPageChange: setCurrentPage,
          totalPages: orders.data?.meta.totalPages ?? 1,
        }}
      />
    </div>
  );
}
