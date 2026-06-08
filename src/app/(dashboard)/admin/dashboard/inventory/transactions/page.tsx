"use client";

import { Button, Card, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useAuthStore } from "@/stores/auth.store";
import { useProductStockMovementQuery } from "@/lib/api/hooks/stock";
import { Column, DataTable } from "@/components/shared/data-table";
import { StockMovementResponse, StockMovementType } from "@/types/stock/movement";

type StockMovementTableRow = StockMovementResponse & {
  serial: number;
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatLabel = (value?: string | null) => {
  if (!value) return "-";

  return value.replaceAll("_", " ");
};

const getMovementColor = (movementType: StockMovementType) => {
  switch (movementType) {
    case "PURCHASE_IN":
    case "SALE_RETURN_IN":
    case "ADJUSTMENT_IN":
    case "TRANSFER_IN":
    case "RESERVATION_RELEASED":
      return "green";

    case "PURCHASE_RETURN_OUT":
    case "SALE_OUT":
    case "ADJUSTMENT_OUT":
    case "TRANSFER_OUT":
    case "RESERVED":
      return "red";

    default:
      return "default";
  }
};

const getQuantitySign = (movementType: StockMovementType) => {
  switch (movementType) {
    case "PURCHASE_IN":
    case "SALE_RETURN_IN":
    case "ADJUSTMENT_IN":
    case "TRANSFER_IN":
    case "RESERVATION_RELEASED":
      return "+";

    case "PURCHASE_RETURN_OUT":
    case "SALE_OUT":
    case "ADJUSTMENT_OUT":
    case "TRANSFER_OUT":
    case "RESERVED":
      return "-";

    default:
      return "";
  }
};

export default function InventoryTransactionsPage() {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const limit = 5;

  const {
    data: movements,
    isLoading,
    isFetching,
  } = useProductStockMovementQuery(businessId
    , {
    page: currentPage,
    limit,
    search
  }
);

  console.log('data', movements);

  const total = movements?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const tableData: StockMovementTableRow[] =
    movements?.items?.map((item, index) => ({
      ...item,
      serial: (currentPage - 1) * limit + index + 1,
    })) ?? [];

  const columns: Column<StockMovementTableRow>[] = [
    {
      key: "serial",
      label: "SL",
      render: (row) => row.serial,
    },
    {
      key: "Product",
      label: "Product",
      type: "primary",
      render: (row) => (
        <strong>{row?.product?.name}</strong>
      ),
    },
    {
      key: "movementType",
      label: "Movement Type",
      type: "primary",
      render: (row) => (
        <Tag color={getMovementColor(row.movementType)}>
          {formatLabel(row.movementType)}
        </Tag>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (row) => (
        <strong>
          {getQuantitySign(row.movementType)}
          {Number(row.quantity ?? 0)}
        </strong>
      ),
    },
    {
      key: "warehouse",
      label: "Warehouse",
      render: (row) => (
        <div>
          <strong>{row.warehouse?.name ?? "-"}</strong>
          <div className="text-xs text-gray-500">
            {row.warehouse?.phone ?? "-"}
          </div>
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) => {
        const totalQuantity = Number(row.stock?.totalQuantity ?? 0);
        const reservedQuantity = Number(row.stock?.quantityReserved ?? 0);
        const availableQuantity = totalQuantity - reservedQuantity;

        return (
          <div>
            <div>Total: {totalQuantity}</div>
            <div className="text-xs text-gray-500">
              Available: {availableQuantity}
            </div>
          </div>
        );
      },
    },
    {
      key: "referenceType",
      label: "Reference",
      render: (row) =>
        row.referenceType ? <Tag>{formatLabel(row.referenceType)}</Tag> : "-",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => formatDate(row.createdAt),
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
                `/admin/dashboard/inventory/stock-overview/details/${row.stockId}`
              )
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Movements"
        subtitle="View stock movement history, purchases, sales, adjustments, transfers, and reservations."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={tableData}
          // toolbarEnd={
          //   <div className="flex flex-col gap-3 md:flex-row">
          //     <Select
          //       placeholder="Movement type"
          //       allowClear
          //       style={{ width: 220 }}
          //       options={movementTypeOptions}
          //       onChange={(value) => {
          //         setCurrentPage(1);
          //         setMovementTypeFilter((value ?? "") as StockMovementType | "");
          //       }}
          //     />

          //     <Select
          //       placeholder="Reference type"
          //       allowClear
          //       style={{ width: 220 }}
          //       options={referenceTypeOptions}
          //       onChange={(value) => {
          //         setCurrentPage(1);
          //         setReferenceTypeFilter(
          //           (value ?? "") as StockReferenceType | ""
          //         );
          //       }}
          //     />
          //   </div>
          // }
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