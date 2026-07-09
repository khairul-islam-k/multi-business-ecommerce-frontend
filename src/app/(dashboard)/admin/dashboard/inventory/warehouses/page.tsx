"use client";

import {
  CirclePlus,
  Pencil,
  Trash2
} from "lucide-react";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Popconfirm, Select, Tag } from "antd";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import {
  useWarehouseMutation,
  useWarehousesQuery,
} from "@/lib/api/hooks/warehouse";
import { useAuthStore } from "@/stores/auth.store";
import { WarehouseResponse, WarehouseStatus } from "@/types/product/warehouse";

const Warehouses = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [statusFilter, setStatusFilter] = useState<
    WarehouseStatus | undefined
  >();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const {
    data: warehouses,
    isLoading,
    isFetching,
  } = useWarehousesQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    sortOrder: "desc",
  });

  const { removeWarehouse } = useWarehouseMutation(businessId);

  const total = warehouses?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removeWarehouse.mutateAsync(id);
      message.success("Warehouse deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<WarehouseResponse>[] = [
    {
      key: "name",
      label: "Warehouse Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      key: "address",
      label: "Address",
      render: (row) => row.address || "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "_count",
      label: "Stocks",
      render: (row) => row._count?.stocks ?? 0,
    },
    {
      key: "movements",
      label: "Movements",
      render: (row) => row._count?.movements ?? 0,
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
            icon={<Pencil />}
            onClick={() =>
              router.push(
                `/admin/dashboard/inventory/warehouses/edit/${row.id}`,
              )
            }
          />

          <Popconfirm
            title="Delete warehouse?"
            description="Are you sure you want to delete this warehouse?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(row.id)}
          >
            <Button danger size="small" icon={<Trash2 />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        subtitle="Manage warehouse locations, contact numbers, stock counts, and stock movements."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={warehouses?.items ?? []}
          columns={columns}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push("/admin/dashboard/inventory/warehouses/create")
                }
              >
                New Warehouse
              </Button>
            </div>
          }
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={isLoading || isFetching}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages,
          }}
        />
      </Card>
    </div>
  );
};

export default Warehouses;
