"use client";

import { Card, Table } from "antd";
import { notFound, useParams } from "next/navigation";
import { CreditCardOutlined } from "@ant-design/icons";

import { mockOrders, mockPayments } from "../../data";
import { PaymentStatusBadge } from "../../_components/badge";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function OrderPaymentHistory({}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = useParams();
  const order = mockOrders.find((order) => order.id === id);
  const payments = mockPayments.filter((payment) => payment.order_id === id);

  if (!order) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Payment History" breadcrumb={adminBreadcrumb} />

      <Card
        title={
          <>
            <CreditCardOutlined /> Transactions
          </>
        }
      >
        <Table
          dataSource={payments}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Method",
              dataIndex: "payment_method",
              key: "payment_method",
              render: (v) => <span className="font-medium">{v}</span>,
            },
            {
              title: "Transaction Ref",
              dataIndex: "transaction_ref",
              key: "transaction_ref",
              render: (v) => v || "—",
              className: "font-mono text-sm text-gray-500",
            },
            {
              title: "Status",
              dataIndex: "payment_status",
              key: "payment_status",
              render: (status) => <PaymentStatusBadge status={status} />,
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              align: "right",
              render: (amt) => (
                <span className="font-mono">${amt.toFixed(2)}</span>
              ),
            },
            {
              title: "Date",
              dataIndex: "paid_at",
              key: "paid_at",
              render: (d) => new Date(d).toDateString(),
              className: "text-gray-500",
            },
          ]}
        />
      </Card>
    </div>
  );
}
