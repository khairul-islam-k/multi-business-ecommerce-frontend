"use client";

import { Card, Empty, Table } from "antd";
import { CreditCard } from "lucide-react";
import { useParams } from "next/navigation";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { useOrder } from "@/lib/api";

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

export default function OrderPaymentHistory() {
  const { id } = useParams();
  const businessId = useActiveBusinessId();
  const orderId = String(id ?? "");
  const order = useOrder(businessId ?? "", orderId);

  if (!businessId) return <Empty description="No active business selected" />;
  if (order.isLoading) return <Loader label="Loading payment history" />;
  if (!order.data) return <Empty description="Order not found" />;

  const payments = order.data.payments ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History"
        subtitle={order.data.orderNo ?? order.data.id}
        breadcrumb={adminBreadcrumb}
      />

      <Card
        title={
          <span className="inline-flex items-center gap-2">
            <CreditCard size={16} /> Transactions
          </span>
        }
      >
        <Table
          dataSource={payments}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Payment No",
              dataIndex: "paymentNo",
              key: "paymentNo",
              render: (value) => value ?? "-",
            },
            {
              title: "Method",
              dataIndex: "paymentMethod",
              key: "paymentMethod",
              render: (value) => (
                <span className="font-medium">{value ?? "-"}</span>
              ),
            },
            {
              title: "Transaction Ref",
              dataIndex: "transactionReference",
              key: "transactionReference",
              render: (value) => value || "-",
              className: "font-mono text-sm text-gray-500",
            },
            {
              title: "Status",
              dataIndex: "paymentStatus",
              key: "paymentStatus",
              render: (status) => status ?? "-",
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              align: "right",
              render: (amount) => (
                <span className="font-mono">{money(amount)}</span>
              ),
            },
            {
              title: "Date",
              dataIndex: "paidAt",
              key: "paidAt",
              render: (date) =>
                date ? new Date(String(date)).toLocaleString() : "-",
              className: "text-gray-500",
            },
          ]}
        />
      </Card>
    </div>
  );
}
