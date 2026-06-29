"use client";

import { Button, Card, Empty, Select, Tag } from "antd";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { usePaymentGatewaysQuery } from "@/lib/api";

import type {
  PaymentGatewayDefinition,
  PaymentGatewayStatus,
} from "@/types/payment-gateway";

const getGatewayName = (gateway: PaymentGatewayDefinition) =>
  gateway.displayName ??
  gateway.name ??
  gateway.provider ??
  gateway.slug ??
  "-";

const getGatewayCode = (gateway: PaymentGatewayDefinition) =>
  gateway.provider ?? gateway.code ?? gateway.slug ?? gateway.name ?? "-";

export default function PaymentGatewayList() {
  const router = useRouter();
  const businessId = useActiveBusinessId();
  const [status, setStatus] = useState<PaymentGatewayStatus | undefined>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = usePaymentGatewaysQuery(
    businessId ?? "",
    {
      page: currentPage,
      limit,
      search,
      status,
    },
  );

  const columns: Column<PaymentGatewayDefinition>[] = [
    {
      key: "name",
      label: "Gateway",
      type: "primary",
      render: (row) => <strong>{getGatewayName(row)}</strong>,
    },
    {
      key: "provider",
      label: "Provider",
      render: (row) => getGatewayCode(row),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => row.description ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "default"}>
          {row.status ?? "AVAILABLE"}
        </Tag>
      ),
    },
  ];

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Gateways"
        subtitle="Review predefined providers and configure the ones your business will use for checkout payments."
        breadcrumb={adminBreadcrumb}
        actions={
          <Button
            icon={<Settings />}
            onClick={() =>
              router.push("/admin/dashboard/payment-gateway/configurations")
            }
          >
            Configurations
          </Button>
        }
      />

      <Card>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          loading={isLoading || isFetching}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          extra={
            <Select
              allowClear
              placeholder="Filter by status"
              className="w-full sm:w-44"
              value={status}
              onChange={(value) => {
                setStatus(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          }
          actions={(row) => (
            <Button
              size="small"
              icon={<Settings />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/payment-gateway/configurations?provider=${getGatewayCode(row)}`,
                )
              }
            >
              Configure
            </Button>
          )}
          pagination={{
            currentPage,
            totalPages: data?.meta.totalPages ?? 1,
            onPageChange: setCurrentPage,
          }}
        />
      </Card>
    </div>
  );
}
