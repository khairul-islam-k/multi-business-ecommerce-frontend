"use client";

import { Alert, Card, Empty, Table, Tag, Typography } from "antd";
import { useParams } from "next/navigation";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import {
  useOrder,
  useOrderReturnsQuery,
  type OrderReturnStatus,
} from "@/lib/api";

const { Text } = Typography;

const statusColor: Record<OrderReturnStatus, string> = {
  APPROVED: "blue",
  CANCELLED: "default",
  COMPLETED: "green",
  REJECTED: "red",
  REQUESTED: "orange",
};

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

export default function OrderReturnHistory() {
  const { id } = useParams();
  const businessId = useActiveBusinessId();
  const orderId = String(id ?? "");
  const order = useOrder(businessId ?? "", orderId);
  const returns = useOrderReturnsQuery(businessId ?? "", {
    page: 1,
    limit: 100,
    orderId,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (!businessId) return <Empty description="No active business selected" />;
  if (order.isLoading || returns.isLoading) {
    return <Loader label="Loading return history" />;
  }
  if (!order.data) return <Empty description="Order not found" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return History"
        subtitle={order.data.orderNo ?? order.data.id}
        breadcrumb={adminBreadcrumb}
      />

      <Alert
        type="info"
        showIcon
        message="Dashboard return creation is not available in the current API."
        description="This page shows return requests that already exist for the order. The dashboard API currently supports viewing returns and updating return status."
      />

      <Card title="Returns">
        <Table
          dataSource={returns.data?.items ?? []}
          rowKey="id"
          pagination={false}
          loading={returns.isFetching}
          columns={[
            {
              title: "Return No",
              dataIndex: "returnNo",
              key: "returnNo",
              render: (value, record) => (
                <Text code>{value ?? record.id}</Text>
              ),
            },
            {
              title: "Reason",
              dataIndex: "reason",
              key: "reason",
              render: (value) => value ?? "-",
            },
            {
              title: "Items",
              dataIndex: "items",
              key: "items",
              render: (items) => Array.isArray(items) ? items.length : 0,
            },
            {
              title: "Amount",
              dataIndex: "totalAmount",
              key: "totalAmount",
              align: "right",
              render: (amount) => money(amount),
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status) => {
                const currentStatus = status as OrderReturnStatus | undefined;
                return currentStatus ? (
                  <Tag color={statusColor[currentStatus]}>{currentStatus}</Tag>
                ) : (
                  "-"
                );
              },
            },
            {
              title: "Created",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (date) =>
                date ? new Date(String(date)).toLocaleString() : "-",
            },
          ]}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                rowKey="id"
                dataSource={record.items ?? []}
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Order item",
                    dataIndex: "orderItemId",
                    key: "orderItemId",
                  },
                  {
                    title: "Qty",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Reason",
                    dataIndex: "reason",
                    key: "reason",
                    render: (value) => value ?? "-",
                  },
                  {
                    title: "Line total",
                    dataIndex: "lineTotal",
                    key: "lineTotal",
                    align: "right",
                    render: (value) => money(value),
                  },
                ]}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
}
