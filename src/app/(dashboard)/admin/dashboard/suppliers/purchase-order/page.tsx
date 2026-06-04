"use client";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  usePurchaseOrderMutation,
  usePurchaseOrderQuery,
} from "@/lib/api/hooks/purchase-order";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { PurchaseOrderResponse } from "@/types/suppliers/purchase-order";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { App, Button, Popconfirm, Select, Tag } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type PurchaseOrderStatus = "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";


const PurchaseOrder = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus>();
  const limit = 5;

  const {
    data: purchaseOrder,
    isLoading,
    isFetching,
  } = usePurchaseOrderQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    // sortOrder: "desc",
  });

  console.log('data', purchaseOrder);

  const { removePurchaseOrder } = usePurchaseOrderMutation(businessId);

  const total = purchaseOrder?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removePurchaseOrder.mutateAsync(id);
      message.success("Deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<PurchaseOrderResponse>[] = [
    {
      key: "purchaseOrderNo",
      label: "PO Number",
      type: "primary",
      render: (row) => <strong>{row.purchaseOrderNo}</strong>,
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (row) => row.supplier?.name ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag
          color={
            row.status === "DRAFT"
              ? "default"
              : row.status === "ORDERED"
                ? "blue"
                : row.status === "RECEIVED"
                  ? "green"
                  : "red"
          }
        >
          {row.status}
        </Tag>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row) => row.items?.length ?? 0,
    },
    {
      key: "expectedDeliveryDate",
      label: "Expected Date",
      render: (row) =>
        new Date(row.expectedDeliveryDate).toLocaleDateString(),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (row) => row.totalAmount,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/suppliers/purchase-order/view/${row.id}`
              )
            }
          />

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(
                `/admin/dashboard/suppliers/purchase-order/update/${row.id}`
              )
            }
          />

          <Popconfirm
            title="Delete purchase order?"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage procurement orders, suppliers, items, costs, and status."
        breadcrumb={adminBreadcrumb}
      />

      <DataTable
        data={purchaseOrder?.items ?? []}
        toolbarEnd={
          <div className="flex flex-col gap-3 md:flex-row">
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 180 }}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Ordered", value: "ORDERED" },
                { label: "Received", value: "RECEIVED" },
                { label: "Cancelled", value: "CANCELLED" },
              ]}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                router.push("/admin/dashboard/suppliers/purchase-order/create")
              }
            >
              Create PO
            </Button>
          </div>
        }
        columns={columns}
        onSearch={(value) => setSearch(value)}
        loading={isLoading || isFetching}
        pagination={{
          currentPage,
          onPageChange: setCurrentPage,
          totalPages,
        }}
      />
    </div>
  );
};

export default PurchaseOrder;