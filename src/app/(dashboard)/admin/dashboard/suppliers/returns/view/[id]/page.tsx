"use client";

import { Card, Descriptions, Empty, Spin, Table, Tag, Typography } from "antd";
import { useParams } from "next/navigation";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { usePurchaseOrderReturn } from "@/lib/api/hooks/purchase-order-return";
import { useAuthStore } from "@/stores/auth.store";
import {
  PurchaseReturnItem,
  PurchaseReturnStatus,
} from "@/types/suppliers/return";

import type { ColumnsType } from "antd/es/table";
const getStatusColor = (status: PurchaseReturnStatus) => {
  if (status === "DRAFT") return "default";
  if (status === "PENDING") return "blue";
  if (status === "COMPLETED") return "green";
  if (status === "CANCELLED") return "red";

  return "default";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

const formatAmount = (amount?: string | null) => {
  if (!amount) return "0";
  return amount;
};

const ReturnView = () => {
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { id } = useParams<{ id: string }>();

  const {
    data: returns,
    isLoading,
    isFetching,
  } = usePurchaseOrderReturn(businessId, id);

  const columns: ColumnsType<PurchaseReturnItem> = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (value) => value ?? "-",
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      render: (value) => formatAmount(value),
    },
    {
      title: "Discount",
      dataIndex: "discountAmount",
      render: (value) => formatAmount(value),
    },
    {
      title: "Tax",
      dataIndex: "taxAmount",
      render: (value) => formatAmount(value),
    },
    {
      title: "Line Total",
      dataIndex: "lineTotal",
      render: (value) => <strong>{formatAmount(value)}</strong>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (value) => value ?? "-",
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center py-10">
        <Spin />
      </div>
    );
  }

  if (!returns) {
    return <Empty description="Return not found" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Return Details"
        subtitle="View supplier return information, items, invoice, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Typography.Title level={4} className="!mb-1">
              {returns.returnNo}
            </Typography.Title>

            <Typography.Text type="secondary">
              Return Date: {formatDate(returns.returnDate)}
            </Typography.Text>
          </div>

          <Tag color={getStatusColor(returns.status)} className="w-fit">
            {returns.status}
          </Tag>
        </div>

        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
          <Descriptions.Item label="Supplier">
            {returns.supplier?.name ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Company">
            {returns.supplier?.companyName ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Phone">
            {returns.supplier?.phone ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Purchase Order">
            {returns.purchaseOrder?.purchaseOrderNo ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Supplier Invoice">
            {returns.supplierInvoice?.invoiceNo ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Invoice Status">
            <Tag>{returns.supplierInvoice?.status ?? "-"}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Tax">
            {returns.tax?.name ?? "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Tax Rate">
            {returns.taxRate}%
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDate(returns.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Reason" span={3}>
            {returns.reason ?? "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Returned Items">
        <Table
          columns={columns}
          dataSource={returns.items ?? []}
          rowKey={(_, index) => String(index)}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>

      <Card title="Amount Summary">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 4 }}>
          <Descriptions.Item label="Subtotal">
            {formatAmount(returns.subtotal)}
          </Descriptions.Item>

          <Descriptions.Item label="Discount">
            {formatAmount(returns.discountTotal)}
          </Descriptions.Item>

          <Descriptions.Item label="Tax">
            {formatAmount(returns.taxTotal)}
          </Descriptions.Item>

          <Descriptions.Item label="Total">
            <strong>{formatAmount(returns.totalAmount)}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ReturnView;
