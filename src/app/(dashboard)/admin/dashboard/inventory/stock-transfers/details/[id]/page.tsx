"use client";

import {
  ArrowLeft
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useStockTransfer } from "@/lib/api/hooks/stock-transfer";
import { useAuthStore } from "@/stores/auth.store";
import { StockTransferResponse, StockTransferStatus } from "@/types/stock/stock-tansfer";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Spin,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useRouter } from "next/navigation";

type TransferItemRow = {
  serial: number;
  requestedQuantity: string;
  transferredQuantity: string;
  receivedQuantity: string;
  pendingQuantity: number;
  createdAt: string;
};

const statusColor: Record<StockTransferStatus, string> = {
  DRAFT: "default",
  PENDING: "blue",
  APPROVED: "green",
  SHIPPED: "cyan",
  RECEIVED: "purple",
  CANCELLED: "orange",
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleString();
};

const getTotalQuantity = (
  items: StockTransferResponse["items"] = [],
  key: "requestedQuantity" | "transferredQuantity" | "receivedQuantity",
) => {
  return items.reduce((total, item) => total + Number(item[key] ?? 0), 0);
};

export default function StockTransferDetails() {
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { id } = useParams<{ id: string }>();

  const {
    data: transfer,
    isLoading,
    isFetching,
  } = useStockTransfer(businessId, id);

  const tableData: TransferItemRow[] =
    transfer?.items?.map((item, index) => {
      const requestedQuantity = Number(item.requestedQuantity ?? 0);
      const receivedQuantity = Number(item.receivedQuantity ?? 0);

      return {
        serial: index + 1,
        requestedQuantity: item.requestedQuantity,
        transferredQuantity: item.transferredQuantity,
        receivedQuantity: item.receivedQuantity,
        pendingQuantity: requestedQuantity - receivedQuantity,
        createdAt: item.createdAt,
      };
    }) ?? [];

  const columns: ColumnsType<TransferItemRow> = [
    {
      title: "SL",
      dataIndex: "serial",
      key: "serial",
      width: 70,
    },
    {
      title: "Requested Qty",
      dataIndex: "requestedQuantity",
      key: "requestedQuantity",
      render: (value) => Number(value ?? 0),
    },
    {
      title: "Transferred Qty",
      dataIndex: "transferredQuantity",
      key: "transferredQuantity",
      render: (value) => Number(value ?? 0),
    },
    {
      title: "Received Qty",
      dataIndex: "receivedQuantity",
      key: "receivedQuantity",
      render: (value) => Number(value ?? 0),
    },
    {
      title: "Pending Qty",
      dataIndex: "pendingQuantity",
      key: "pendingQuantity",
      render: (value) => Number(value ?? 0),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => formatDate(value),
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Stock Transfer Details"
          subtitle="View warehouse transfer information, status, quantities, and stock movement progress."
          breadcrumb={adminBreadcrumb}
        />

        <Card>
          <Empty description="Stock transfer not found" />
        </Card>
      </div>
    );
  }

  const totalRequestedQty = getTotalQuantity(transfer.items, "requestedQuantity");
  const totalTransferredQty = getTotalQuantity(
    transfer.items,
    "transferredQuantity",
  );
  const totalReceivedQty = getTotalQuantity(transfer.items, "receivedQuantity");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfer Details"
        subtitle="View warehouse transfer information, status, quantities, and stock movement progress."
        breadcrumb={adminBreadcrumb}
      />

      <Button icon={<ArrowLeft />} onClick={() => router.back()}>
        Back
      </Button>

      <Card
        title="Transfer Information"
        extra={<Tag color={statusColor[transfer.status]}>{transfer.status}</Tag>}
      >
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Transfer No">
            {transfer.transferNo}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={statusColor[transfer.status]}>{transfer.status}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="From Warehouse">
            {transfer.fromWarehouse?.name ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="To Warehouse">
            {transfer.toWarehouse?.name ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="From Warehouse Phone">
            {transfer.fromWarehouse?.phone ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="To Warehouse Phone">
            {transfer.toWarehouse?.phone ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="From Warehouse Address">
            {transfer.fromWarehouse?.address ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="To Warehouse Address">
            {transfer.toWarehouse?.address ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Note" span={2}>
            {transfer.note || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDate(transfer.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {formatDate(transfer.updatedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Shipped At">
            {formatDate(transfer.shippedAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Received At">
            {formatDate(transfer.receivedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Quantity Summary">
        <Descriptions bordered column={{ xs: 1, md: 3 }}>
          <Descriptions.Item label="Total Requested">
            {totalRequestedQty}
          </Descriptions.Item>

          <Descriptions.Item label="Total Transferred">
            {totalTransferredQty}
          </Descriptions.Item>

          <Descriptions.Item label="Total Received">
            {totalReceivedQty}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Transfer Items">
        <Table
          rowKey={(row) => String(row.serial)}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}