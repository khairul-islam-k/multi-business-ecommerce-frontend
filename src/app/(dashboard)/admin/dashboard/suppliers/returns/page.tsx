"use client";

import { App, Button, Card, Popconfirm, Select, Tag, Tooltip } from "antd";
import { CircleCheck, CircleX, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  usePurchaseOrderReturnMutation,
  usePurchaseOrderReturnQuery,
} from "@/lib/api/hooks/purchase-order-return";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import {
  PurchaseReturnResponse,
  PurchaseReturnStatus,
} from "@/types/suppliers/return";

const getStatusColor = (status: PurchaseReturnStatus) => {
  if (status === "DRAFT") return "default";
  if (status === "PENDING") return "blue";
  if (status === "COMPLETED") return "green";
  return "red";
};

const ReturnPage = () => {
  const { message } = App.useApp();
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseReturnStatus>();

  const limit = 10;

  const {
    data: returns,
    isLoading,
    isFetching,
  } = usePurchaseOrderReturnQuery(businessId);

  console.log("return", returns);

  const { updateReturnComplete, updateReturnCancel } =
    usePurchaseOrderReturnMutation(businessId);

  console.log("returns", returns);

  const returnItems: PurchaseReturnResponse[] = Array.isArray(returns)
    ? returns
    : (returns?.items ?? []);

  const filteredReturns = useMemo(() => {
    return returnItems.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.returnNo.toLowerCase().includes(searchValue) ||
        item.supplier?.name?.toLowerCase().includes(searchValue) ||
        item.purchaseOrder?.purchaseOrderNo
          ?.toLowerCase()
          .includes(searchValue) ||
        item.supplierInvoice?.invoiceNo?.toLowerCase().includes(searchValue);

      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [returnItems, search, statusFilter]);

  const totalPages = Math.ceil(filteredReturns.length / limit);

  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * limit,
    currentPage * limit,
  );

  const handleComplete = async (id: string) => {
    try {
      const res = await updateReturnComplete.mutateAsync(id);
      message.success("Return completed successfully");
      console.log("res", res);
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await updateReturnCancel.mutateAsync(id);
      console.log("res", res);
      message.success("Return cancelled successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<PurchaseReturnResponse>[] = [
    {
      key: "returnNo",
      label: "Return No",
      type: "primary",
      render: (row) => <strong>{row.returnNo}</strong>,
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (row) => row.supplier?.name ?? "-",
    },
    {
      key: "purchaseOrder",
      label: "PO Number",
      render: (row) => row.purchaseOrder?.purchaseOrderNo ?? "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={getStatusColor(row.status)}>{row.status}</Tag>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (row) => row.items?.length ?? 0,
    },
    {
      key: "returnDate",
      label: "Return Date",
      render: (row) => new Date(row.returnDate).toLocaleDateString(),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (row) => row.totalAmount,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const canAction = row.status === "DRAFT" || row.status === "PENDING";

        return (
          <div className="flex items-center gap-2">
            <Tooltip title="View">
              <Button
                size="small"
                icon={<Eye />}
                onClick={() =>
                  router.push(
                    `/admin/dashboard/suppliers/returns/view/${row.id}`,
                  )
                }
              />
            </Tooltip>

            <Popconfirm
              title="Complete return?"
              description="Are you sure you want to complete this return?"
              okText="Yes"
              cancelText="No"
              disabled={!canAction}
              onConfirm={() => handleComplete(row.id)}
            >
              <Tooltip title="Complete">
                <Button
                  size="small"
                  type="primary"
                  icon={<CircleCheck />}
                  disabled={!canAction}
                />
              </Tooltip>
            </Popconfirm>

            <Popconfirm
              title="Cancel return?"
              description="Are you sure you want to cancel this return?"
              okText="Yes"
              cancelText="No"
              disabled={!canAction}
              onConfirm={() => handleCancel(row.id)}
            >
              <Tooltip title="Cancel">
                <Button
                  danger
                  size="small"
                  icon={<CircleX />}
                  disabled={!canAction}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Returns"
        subtitle="Manage supplier return requests, returned items, invoices, and return status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={paginatedReturns}
          toolbarEnd={
            <div>
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180, marginRight: "8px" }}
                value={statusFilter}
                onChange={(value) => {
                  setCurrentPage(1);
                  setStatusFilter(value);
                }}
                options={[
                  { label: "Draft", value: "DRAFT" },
                  { label: "Pending", value: "PENDING" },
                  { label: "Completed", value: "COMPLETED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
              />
              <Button
                type="primary"
                danger
                onClick={() =>
                  router.push(
                    `/admin/dashboard/suppliers/returns/create-return`,
                  )
                }
              >
                Return Request
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
};

export default ReturnPage;
