"use client";

import { Button, Card, Select, Tag, Tooltip } from "antd";
import { Check, CirclePlus, Eye, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import {
  useStockAdjustmentMutation,
  useStockAdjustmentQuery,
} from "@/lib/api/hooks/stock-adjustment";
import { useWarehousesQuery } from "@/lib/api/hooks/warehouse";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

import type {
  StockAdjustmentResponse,
  StockAdjustmentStatus,
} from "@/types/stock/adjustment";

type StockAdjustmentTableRow = StockAdjustmentResponse & {
  serial: number;
};

type SelectOption = {
  label: string;
  value: string;
};

type AdjustmentType = "INCREASE" | "DECREASE";

const statusColor: Record<StockAdjustmentStatus, string> = {
  DRAFT: "default",
  PENDING: "blue",
  APPROVED: "green",
  REJECTED: "red",
  CANCELLED: "orange",
};

const adjustmentTypeColor: Record<AdjustmentType, string> = {
  INCREASE: "green",
  DECREASE: "red",
};

export default function StockAdjustmentListPage() {
  const router = useRouter();
  const swal = useSwal();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const limit = 10;

  const {
    data: adjustments,
    isLoading,
    isFetching,
  } = useStockAdjustmentQuery(businessId, {
    page: currentPage,
    limit,
    search,
    warehouseId,
  });

  const total = adjustments?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const tableData: StockAdjustmentTableRow[] =
    adjustments?.items?.map((item, index) => ({
      ...item,
      serial: (currentPage - 1) * limit + index + 1,
    })) ?? [];

  const {
    data: warehouses,
    isLoading: warehouseLoading,
    isFetching: warehouseFetching,
  } = useWarehousesQuery(businessId, {
    status: "ACTIVE",
    sortOrder: "desc",
  });

  const warehouseOptions: SelectOption[] = useMemo(() => {
    return (
      warehouses?.items?.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
      })) ?? []
    );
  }, [warehouses?.items]);

  const { updateApprove, updateCancel } =
    useStockAdjustmentMutation(businessId);

  const handleApprove = (id: string) => {
    swal.modal.confirm({
      title: "Approve stock adjustment?",
      content: "After approval, stock quantity will be updated.",
      okText: "Approve",
      cancelText: "Cancel",
      centered: true,
      async onOk() {
        try {
          await updateApprove.mutateAsync(id);

          swal.success("Stock adjustment approved successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const handleCancel = (id: string) => {
    swal.modal.confirm({
      title: "Cancel stock adjustment?",
      content: "This stock adjustment will be cancelled.",
      okText: "Cancel Adjustment",
      cancelText: "Close",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await updateCancel.mutateAsync(id);

          swal.success("Stock adjustment cancelled successfully.");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const columns: Column<StockAdjustmentTableRow>[] = [
    {
      key: "serial",
      label: "SL",
      render: (row) => row.serial,
    },
    {
      key: "adjustmentNo",
      label: "Adjustment No",
      type: "primary",
      render: (row) => <strong>{row.adjustmentNo}</strong>,
    },
    {
      key: "warehouse",
      label: "Warehouse",
      render: (row) => row.warehouse?.name ?? "-",
    },
    {
      key: "adjustmentType",
      label: "Type",
      type: "meta",
      render: (row) => (
        <Tag color={adjustmentTypeColor[row.adjustmentType]}>
          {row.adjustmentType}
        </Tag>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row) => row.items?.length ?? 0,
    },
    {
      key: "adjustmentQty",
      label: "Total Qty",
      render: (row) =>
        row.items?.reduce(
          (total, item) => total + Number(item.adjustmentQty ?? 0),
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
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View">
            <Button
              size="small"
              icon={<Eye />}
              onClick={() =>
                router.push(
                  `/admin/dashboard/inventory/stock-adjustments/details/${row.id}`,
                )
              }
            />
          </Tooltip>

          <Tooltip title="Approve">
            <Button
              size="small"
              type="primary"
              icon={<Check />}
              disabled={row.status === "APPROVED" || row.status === "CANCELLED"}
              onClick={() => handleApprove(row.id)}
            />
          </Tooltip>

          <Tooltip title="Cancel">
            <Button
              size="small"
              danger
              icon={<X />}
              disabled={row.status === "APPROVED" || row.status === "CANCELLED"}
              onClick={() => handleCancel(row.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Adjustments"
        subtitle="Manage stock increase, decrease, warehouse adjustments, approval status, and cancellation records."
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
                placeholder="Select warehouse"
                optionFilterProp="label"
                options={warehouseOptions}
                style={{ width: 180 }}
                value={warehouseId || undefined}
                onChange={(value) => {
                  setCurrentPage(1);
                  setWarehouseId(value ?? "");
                }}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push(
                    "/admin/dashboard/inventory/stock-adjustments/create",
                  )
                }
              >
                Create Adjustment
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
