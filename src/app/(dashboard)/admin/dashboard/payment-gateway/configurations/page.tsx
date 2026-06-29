"use client";

import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { useSwal } from "@/hooks/use-swal";
import {
  useFinanceAccountQuery,
  usePaymentGatewayConfigMutations,
  usePaymentGatewayConfigsQuery,
} from "@/lib/api";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getApiErrorMessage } from "@/lib/axios";

import PaymentGatewayConfigModal from "../_components/payment-gateway-config-modal";

import type {
  PaymentGatewayConfig,
  PaymentGatewayConfigPayload,
  PaymentGatewayMode,
  PaymentGatewayProvider,
  PaymentGatewayStatus,
} from "@/types/payment-gateway";

const { Text } = Typography;

const providerOptions: Array<{ label: string; value: PaymentGatewayProvider }> =
  [
    { label: "SSLCommerz", value: "SSLCOMMERZ" },
    { label: "AamarPay", value: "AAMARPAY" },
    { label: "SurjoPay", value: "SURJOPAY" },
  ];

const modeOptions: Array<{ label: string; value: PaymentGatewayMode }> = [
  { label: "Sandbox", value: "SANDBOX" },
  { label: "Live", value: "LIVE" },
];

const statusOptions: Array<{ label: string; value: PaymentGatewayStatus }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const parseProvider = (
  value: string | null,
): PaymentGatewayProvider | undefined =>
  value === "SSLCOMMERZ" || value === "AAMARPAY" || value === "SURJOPAY"
    ? value
    : undefined;

export default function PaymentGatewayConfigurations() {
  const businessId = useActiveBusinessId();
  const searchParams = useSearchParams();
  const swal = useSwal();
  const [provider, setProvider] = useState<PaymentGatewayProvider | undefined>(
    () => parseProvider(searchParams.get("provider")),
  );
  const [mode, setMode] = useState<PaymentGatewayMode | undefined>();
  const [status, setStatus] = useState<PaymentGatewayStatus | undefined>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] =
    useState<PaymentGatewayConfig | null>(null);
  const createAccess = usePermissionAccess(PERMISSIONS.paymentCreate);
  const updateAccess = usePermissionAccess(PERMISSIONS.paymentUpdate);
  const deleteAccess = usePermissionAccess(PERMISSIONS.paymentDelete);
  const limit = 10;

  const { data, isLoading, isFetching } = usePaymentGatewayConfigsQuery(
    businessId ?? "",
    {
      page: currentPage,
      limit,
      search,
      provider,
      mode,
      status,
    },
  );
  const { data: financeAccounts, isLoading: financeAccountsLoading } =
    useFinanceAccountQuery(businessId ?? "", {
      page: 1,
      limit: 100,
      status: "ACTIVE",
      // sortBy: "name",
    });
  const { createConfig, updateConfig, removeConfig } =
    usePaymentGatewayConfigMutations(businessId ?? "");

  const financeAccountItems = financeAccounts?.items ?? [];
  const submitting = createConfig.isPending || updateConfig.isPending;

  const handleOpenCreate = () => {
    setEditingConfig(null);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: PaymentGatewayConfigPayload) => {
    try {
      if (editingConfig) {
        await updateConfig.mutateAsync({
          configId: editingConfig.id,
          payload,
        });
        swal.success("Payment gateway configuration updated.");
      } else {
        await createConfig.mutateAsync(payload);
        swal.success("Payment gateway configuration created.");
      }

      setModalOpen(false);
      setEditingConfig(null);
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const handleDelete = async (configId: string) => {
    try {
      await removeConfig.mutateAsync(configId);
      swal.success("Payment gateway configuration deleted.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<PaymentGatewayConfig>[] = [
    {
      key: "provider",
      label: "Provider",
      type: "primary",
      render: (row) => <strong>{row.provider}</strong>,
    },
    {
      key: "mode",
      label: "Mode",
      type: "meta",
      render: (row) => (
        <Tag color={row.mode === "LIVE" ? "green" : "gold"}>{row.mode}</Tag>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "default"}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "financeAccount",
      label: "Settlement account",
      render: (row) =>
        row.financeAccount?.name ??
        financeAccountItems.find(
          (account) => account.id === row.financeAccountId,
        )?.name ??
        row.financeAccountId,
    },
    {
      key: "configData",
      label: "Config keys",
      render: (row) => {
        const keys = Object.keys(row.configData ?? {});

        return keys.length ? (
          <Space size={[4, 4]} wrap>
            {keys.map((key) => (
              <Tag key={key}>{key}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">No keys</Text>
        );
      },
    },
    {
      key: "updatedAt",
      label: "Updated",
      render: (row) =>
        row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-",
    },
  ];

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gateway Configurations"
        subtitle="Create and manage provider credentials, mode, status, and settlement account mappings for checkout payments."
        breadcrumb={adminBreadcrumb}
        actions={
          <Button
            type="primary"
            icon={<CirclePlus />}
            onClick={handleOpenCreate}
            disabled={
              !createAccess.allowed ||
              financeAccountsLoading ||
              !financeAccountItems.length
            }
          >
            Configure Gateway
          </Button>
        }
      />

      {!financeAccountsLoading && !financeAccountItems.length ? (
        <Card>
          <Empty description="Create an active finance account before configuring payment gateways." />
        </Card>
      ) : (
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
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Select
                  allowClear
                  placeholder="Provider"
                  className="w-full sm:w-40"
                  value={provider}
                  onChange={(value) => {
                    setProvider(value);
                    setCurrentPage(1);
                  }}
                  options={providerOptions}
                />
                <Select
                  allowClear
                  placeholder="Mode"
                  className="w-full sm:w-36"
                  value={mode}
                  onChange={(value) => {
                    setMode(value);
                    setCurrentPage(1);
                  }}
                  options={modeOptions}
                />
                <Select
                  allowClear
                  placeholder="Status"
                  className="w-full sm:w-36"
                  value={status}
                  onChange={(value) => {
                    setStatus(value);
                    setCurrentPage(1);
                  }}
                  options={statusOptions}
                />
              </div>
            }
            actions={(row) => (
              <Space size={4}>
                <Button
                  size="small"
                  icon={<Pencil />}
                  disabled={!updateAccess.allowed}
                  onClick={() => {
                    setEditingConfig(row);
                    setModalOpen(true);
                  }}
                />
                {deleteAccess.allowed ? (
                  <Popconfirm
                    title="Delete gateway configuration?"
                    description="This will remove the saved credentials for this provider."
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(row.id)}
                  >
                    <Button
                      danger
                      size="small"
                      icon={<Trash2 />}
                      loading={removeConfig.isPending}
                    />
                  </Popconfirm>
                ) : null}
              </Space>
            )}
            pagination={{
              currentPage,
              totalPages: data?.meta.totalPages ?? 1,
              onPageChange: setCurrentPage,
            }}
          />
        </Card>
      )}

      <PaymentGatewayConfigModal
        open={modalOpen}
        mode={editingConfig ? "update" : "create"}
        config={editingConfig}
        financeAccounts={financeAccountItems}
        loading={submitting}
        onCancel={() => {
          setModalOpen(false);
          setEditingConfig(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
