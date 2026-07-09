"use client";

import { App, Button, Popconfirm, Select, Tag } from "antd";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useTaxMutation, useTaxQuery } from "@/lib/api/hooks/tax";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { TaxResponse } from "@/types/finance/tax";

const FinanceTax = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const limit = 10;

  const {
    data: taxes,
    isLoading,
    isFetching,
  } = useTaxQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
  });

  const { removeTax } = useTaxMutation(businessId);

  const total = taxes?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id: string) => {
    try {
      await removeTax.mutateAsync(id);
      message.success("Deleted successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<TaxResponse>[] = [
    {
      key: "name",
      label: "Tax Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "rate",
      label: "Rate",
      render: (row) => `${row.rate}%`,
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
              router.push(`/admin/dashboard/finance/tax/edit/${row.id}`)
            }
          />

          <Popconfirm
            title="Delete tax?"
            description="Are you sure?"
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
        title="Finance Tax"
        subtitle="Manage finance tax rates, status, sorting, and usage."
        breadcrumb={adminBreadcrumb}
      />

      <DataTable
        data={taxes?.items ?? []}
        toolbarEnd={
          <div className="flex flex-col gap-3 md:flex-row">
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 180 }}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />

            <Button
              type="primary"
              icon={<CirclePlus />}
              onClick={() => router.push("/admin/dashboard/finance/tax/create")}
            >
              New Tax
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

export default FinanceTax;
