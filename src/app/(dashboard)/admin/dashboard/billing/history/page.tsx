"use client";

import { useState } from "react";
import { Tag } from "antd";

import { useTenantSubscriptionHistory } from "@/lib/api";
import type { TenantSubscription } from "@/lib/api";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import {
  dateText,
  money,
  optionLabel,
  subscriptionStatusColor,
} from "../_utils/package-display";

export default function BillingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const history = useTenantSubscriptionHistory({
    page: currentPage,
    limit: 10,
    search,
  });

  const columns: Column<TenantSubscription>[] = [
    {
      key: "package",
      label: "Package",
      type: "primary",
      render: (row) => row.package?.name ?? "-",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => money(row.price, row.currencyCode),
    },
    {
      key: "billingCycle",
      label: "Billing",
      render: (row) => optionLabel(row.billingCycle),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={subscriptionStatusColor[row.status]}>
          {optionLabel(row.status)}
        </Tag>
      ),
    },
    {
      key: "currentPeriodEnd",
      label: "Period end",
      render: (row) => dateText(row.currentPeriodEnd),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription History"
        subtitle="Review previous and current package subscriptions for this tenant."
        breadcrumb={adminBreadcrumb}
      />

      <DataTable
        data={history.data?.items ?? []}
        columns={columns}
        loading={history.isLoading || history.isFetching}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        pagination={{
          currentPage,
          totalPages: history.data?.meta.totalPages ?? 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
