"use client";

import { Card, Select, Tag } from "antd";
import { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useCourierProviderQuery } from "@/lib/api/hooks/courier";
import { useAuthStore } from "@/stores/auth.store";
import { CourierProvider as TCourierProvider, CourierStatus } from "../courier-config/page";

const CourierProvider = () => {
  const [statusFilter, setStatusFilter] = useState<CourierStatus | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const limit = 10;

  const {
    data: couriers,
    isLoading: courierLoading,
    isFetching: courierFetching,
  } = useCourierProviderQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter
  });



  const total = couriers?.meta.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const columns: Column<TCourierProvider>[] = [
    {
      key: "name",
      label: "Courier Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "code",
      label: "Code",
      render: (row) => <Tag color="blue">{row.code}</Tag>,
    },
    {
      key: "description",
      label: "Description",
      render: (row) => row.description || "-",
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
      key: "createdAt",
      label: "Created At",
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courier Providers"
        subtitle="Manage and view available courier providers for your business."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={couriers?.items ?? []}
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
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={courierLoading || courierFetching}
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

export default CourierProvider;