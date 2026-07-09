"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  App,
  Button,
  Card,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { Ban, Check, CircleCheck, Eye, X } from "lucide-react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import Pagination from "@/components/shared/pagination";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import { getApiErrorMessage } from "@/lib/axios";
import {
  useOrderMutations,
  useOrderReturnsQuery,
  type OrderReturnResponse,
  type OrderReturnStatus,
} from "@/lib/api";

const { Search } = Input;
const returnStatuses: OrderReturnStatus[] = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
];

const statusColor: Record<OrderReturnStatus, string> = {
  APPROVED: "blue",
  CANCELLED: "default",
  COMPLETED: "green",
  REJECTED: "red",
  REQUESTED: "orange",
};

const statusActions: Array<{
  status: OrderReturnStatus;
  label: string;
  icon: ReactNode;
  danger?: boolean;
}> = [
  { status: "APPROVED", label: "Approve return", icon: <Check size={16} /> },
  { status: "REJECTED", label: "Reject return", icon: <X size={16} />, danger: true },
  {
    status: "COMPLETED",
    label: "Complete return",
    icon: <CircleCheck size={16} />,
  },
  { status: "CANCELLED", label: "Cancel return", icon: <Ban size={16} />, danger: true },
];

function money(value: string | number | null | undefined) {
  return `BDT ${Number(value ?? 0).toLocaleString()}`;
}

export default function OrderReturnsPage() {
  const businessId = useActiveBusinessId();
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderReturnStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const returnsQuery = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      search,
      status,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    }),
    [currentPage, search, status],
  );
  const returns = useOrderReturnsQuery(businessId ?? "", returnsQuery);
  const mutations = useOrderMutations(businessId ?? "");

  const updateStatus = async (
    record: OrderReturnResponse,
    nextStatus: OrderReturnStatus,
  ) => {
    try {
      await mutations.updateReturnStatus.mutateAsync({
        returnId: record.id,
        status: nextStatus,
      });
      message.success(
        `Return ${record.returnNo ?? record.id} marked as ${nextStatus}.`,
      );
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) return <Empty description="No active business selected" />;
  if (returns.isLoading && !returns.data) {
    return <Loader label="Loading order returns" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Order Returns" breadcrumb={adminBreadcrumb} />

      <Card>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <Search
            placeholder="Search return or order"
            allowClear
            onSearch={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            className="w-full md:max-w-xs"
          />
          <Select
            placeholder="Filter status"
            allowClear
            className="w-full md:max-w-52"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
            }}
            options={returnStatuses.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </div>

        <Table<OrderReturnResponse>
          columns={[
            {
              title: "Return No",
              dataIndex: "returnNo",
              key: "returnNo",
              render: (value, record) => (
                <span className="font-semibold">{value ?? record.id}</span>
              ),
            },
            {
              title: "Order",
              key: "order",
              render: (_, record) =>
                record.orderId ? (
                  <Link href={`/admin/dashboard/orders/${record.orderId}`}>
                    {record.order?.orderNo ?? record.orderId}
                  </Link>
                ) : (
                  "-"
                ),
            },
            {
              title: "Customer",
              key: "customer",
              render: (_, record) =>
                record.order?.customerName ??
                record.order?.customerEmail ??
                "-",
            },
            {
              title: "Reason",
              dataIndex: "reason",
              key: "reason",
              render: (value) => value ?? "-",
            },
            {
              title: "Amount",
              dataIndex: "totalAmount",
              key: "totalAmount",
              align: "right",
              render: (value) => money(value),
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (value) => {
                const currentStatus = value as OrderReturnStatus | undefined;
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
              render: (value) =>
                value ? new Date(String(value)).toLocaleString() : "-",
            },
            {
              title: "Actions",
              key: "actions",
              fixed: "right",
              render: (_, record) => (
                <Space size={4}>
                  <Link
                    href={`/admin/dashboard/orders/${record.orderId}/returns`}
                  >
                    <Tooltip title="View order returns">
                      <Button size="small" type="text" icon={<Eye size={16} />} />
                    </Tooltip>
                  </Link>
                  {statusActions.map((action) => (
                    <Tooltip key={action.status} title={action.label}>
                      <Button
                        size="small"
                        type="text"
                        danger={action.danger}
                        icon={action.icon}
                        disabled={
                          record.status === action.status ||
                          mutations.updateReturnStatus.isPending
                        }
                        onClick={() => updateStatus(record, action.status)}
                      />
                    </Tooltip>
                  ))}
                </Space>
              ),
            },
          ]}
          dataSource={returns.data?.items ?? []}
          rowKey="id"
          loading={returns.isFetching}
          pagination={false}
          scroll={{ x: "max-content" }}
        />

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={returns.data?.meta.totalPages ?? 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
}
