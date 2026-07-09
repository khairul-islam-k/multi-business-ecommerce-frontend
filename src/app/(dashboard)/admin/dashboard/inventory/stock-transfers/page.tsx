"use client";

import { ChevronDown, CirclePlus, Eye, Inbox, Truck, X } from "lucide-react";

import { Button, Card, Dropdown, MenuProps, Select, Tag, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Column, DataTable } from "@/components/shared/data-table";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import {
  useStockTransferMutation,
  useStockTransferQuery,
} from "@/lib/api/hooks/stock-transfer";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { useAuthStore } from "@/stores/auth.store";
import {
  StockTransferResponse,
  StockTransferStatus,
} from "@/types/stock/stock-tansfer";

type StockTransferTableRow = StockTransferResponse & {
  serial: number;
};

type SelectOption = {
  label: string;
  value: string;
};

const statusColor: Record<StockTransferStatus, string> = {
  DRAFT: "default",
  PENDING: "blue",
  APPROVED: "green",
  SHIPPED: "cyan",
  RECEIVED: "purple",
  CANCELLED: "orange",
};

export default function StockTransferListPage() {
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState<string>("");

  const limit = 10;

  const {
    data: transfers,
    isLoading,
    isFetching,
  } = useStockTransferQuery(businessId, {
    page: currentPage,
    limit,
    search,
    warehouseId,
  });

  const {
    data: warehouses,
    isLoading: warehouseLoading,
    isFetching: warehouseFetching,
  } = useWarehousesQuery(businessId, {
    status: "ACTIVE",
    sortOrder: "desc",
  });

  const { updateShip, updateReceive, updateCancel } =
    useStockTransferMutation(businessId);

  const warehouseOptions: SelectOption[] = useMemo(() => {
    return (
      warehouses?.items?.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
      })) ?? []
    );
  }, [warehouses?.items]);

  const total = transfers?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const tableData: StockTransferTableRow[] =
    transfers?.items?.map((item, index) => ({
      ...item,
      serial: (currentPage - 1) * limit + index + 1,
    })) ?? [];

  // three action
  const handleShip = (id: string) => {
    swal.modal.confirm({
      title: "Ship stock transfer?",
      content:
        "This will mark the transfer as shipped and move stock from the source warehouse.",
      okText: "Ship",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        try {
          await updateShip.mutateAsync(id);
          swal.success("Stock transfer shipped successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const handleReceive = (id: string) => {
    swal.modal.confirm({
      title: "Receive stock transfer?",
      content:
        "This will mark the transfer as received in the destination warehouse.",
      okText: "Receive",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        try {
          await updateReceive.mutateAsync(id);
          swal.success("Stock transfer received successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const handleCancel = (id: string) => {
    swal.modal.confirm({
      title: "Cancel stock transfer?",
      content: "This stock transfer will be cancelled.",
      okText: "Cancel Transfer",
      cancelText: "Close",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await updateCancel.mutateAsync(id);
          swal.success("Stock transfer cancelled successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const columns: Column<StockTransferTableRow>[] = [
    {
      key: "serial",
      label: "SL",
      render: (row) => row.serial,
    },
    {
      key: "transferNo",
      label: "Transfer No",
      type: "primary",
      render: (row) => <strong>{row.transferNo}</strong>,
    },
    {
      key: "fromWarehouse",
      label: "From Warehouse",
      render: (row) => row.fromWarehouse?.name ?? "-",
    },
    {
      key: "toWarehouse",
      label: "To Warehouse",
      render: (row) => row.toWarehouse?.name ?? "-",
    },
    {
      key: "items",
      label: "Items",
      render: (row) => row.items?.length ?? 0,
    },
    {
      key: "requestedQuantity",
      label: "Requested Qty",
      render: (row) =>
        row.items?.reduce(
          (total, item) => total + Number(item.requestedQuantity ?? 0),
          0,
        ) ?? 0,
    },
    {
      key: "transferredQuantity",
      label: "Transferred Qty",
      render: (row) =>
        row.items?.reduce(
          (total, item) => total + Number(item.transferredQuantity ?? 0),
          0,
        ) ?? 0,
    },
    {
      key: "receivedQuantity",
      label: "Received Qty",
      render: (row) =>
        row.items?.reduce(
          (total, item) => total + Number(item.receivedQuantity ?? 0),
          0,
        ) ?? 0,
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => <Tag color={statusColor[row.status]}>{row.status}</Tag>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const canShip = row.status === "DRAFT" || row.status === "PENDING";
        const canReceive = row.status === "SHIPPED";
        const canCancel =
          row.status !== "SHIPPED" &&
          row.status !== "RECEIVED" &&
          row.status !== "CANCELLED";

        const actionItems: MenuProps["items"] = [
          {
            key: "ship",
            label: "Ship",
            icon: <Truck />,
            disabled: !canShip,
            onClick: () => handleShip(row.id),
          },
          {
            key: "receive",
            label: "Receive",
            icon: <Inbox />,
            disabled: !canReceive,
            onClick: () => handleReceive(row.id),
          },
          {
            key: "cancel",
            label: "Cancel",
            icon: <X />,
            danger: true,
            disabled: !canCancel,
            onClick: () => handleCancel(row.id),
          },
        ];

        return (
          <div className="flex items-center gap-2">
            <Tooltip title="View">
              <Button
                size="small"
                icon={<Eye />}
                onClick={() =>
                  router.push(
                    `/admin/dashboard/inventory/stock-transfers/details/${row.id}`,
                  )
                }
              />
            </Tooltip>

            <Dropdown menu={{ items: actionItems }} trigger={["click"]}>
              <Button size="small">
                Actions <ChevronDown />
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfers"
        subtitle="Manage warehouse-to-warehouse stock transfers, approval status, shipped quantity, and received quantity records."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={tableData}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                allowClear
                showSearch
                loading={warehouseLoading || warehouseFetching}
                placeholder="From warehouse"
                optionFilterProp="label"
                options={warehouseOptions}
                style={{ width: 180 }}
                value={warehouseId || undefined}
                onChange={(value) => {
                  setCurrentPage(1);
                  setWarehouseId(value);
                }}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push(
                    "/admin/dashboard/inventory/stock-transfers/create",
                  )
                }
              >
                Create Transfer
              </Button>
            </div>
          }
          columns={columns}
          onSearch={(value) => {
            setCurrentPage(1);
            setSearch(value);
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
}
