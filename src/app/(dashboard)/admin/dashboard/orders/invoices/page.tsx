"use client";

import { Button, Card, Select, Tag } from "antd";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useOrderInvoiceQuery } from "@/lib/api/hooks/invoice";
import { useAuthStore } from "@/stores/auth.store";
import { InvoiceTenantResponse } from "@/types/invoice/invoice";

type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

const getInvoiceStatusColor = (status: InvoiceStatus) => {
  const colors: Record<InvoiceStatus, string> = {
    DRAFT: "default",
    ISSUED: "blue",
    PARTIALLY_PAID: "orange",
    PAID: "green",
    OVERDUE: "red",
    CANCELLED: "default",
  };

  return colors[status] ?? "default";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatMoney = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "৳0";

  return `৳${Number(value).toLocaleString("en-BD")}`;
};

export default function InvoiceList() {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | undefined>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const {
    data: invoices,
    isLoading,
    isFetching,
  } = useOrderInvoiceQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter,
    sortOrder: "desc",
  });

  // pagination
  const total = invoices?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const columns: Column<InvoiceTenantResponse>[] = [
    {
      key: "invoiceNo",
      label: "Invoice No",
      type: "primary",
      render: (row) => <strong>{row.invoiceNo}</strong>,
    },
    {
      key: "order",
      label: "Order",
      render: (row) => (
        <div className="space-y-1">
          <p className="m-0 font-medium">{row.order?.orderNo ?? "-"}</p>
        </div>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      render: (row) => (
        <div className="space-y-1">
          <p className="m-0 font-medium">{row.customerName}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={getInvoiceStatusColor(row.status as InvoiceStatus)}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<Eye size={16} />}
            onClick={() =>
              router.push(`/admin/dashboard/orders/invoices/view/${row.id}`)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        subtitle="Manage customer invoices, billing status, payments, and order invoice history."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={invoices?.items ?? []}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Draft", value: "DRAFT" },
                  { label: "Issued", value: "ISSUED" },
                  { label: "Partially Paid", value: "PARTIALLY_PAID" },
                  { label: "Paid", value: "PAID" },
                  { label: "Overdue", value: "OVERDUE" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
              />
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={isLoading || isFetching}
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages: totalPages,
          }}
        />
      </Card>
    </div>
  );
}
