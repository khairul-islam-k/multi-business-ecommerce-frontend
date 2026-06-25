"use client";

import {
  CircleCheck,
  CirclePlus,
  CircleX,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react";


import { Button, Card, Dropdown, MenuProps, Select, Tag, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Column, DataTable } from "@/components/shared/data-table";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import { useExpenseMutation, useExpenseQuery } from "@/lib/api/hooks/expense";
import { useAuthStore } from "@/stores/auth.store";
import { ExpenseResponse, ExpenseStatus } from "@/types/stock/expense";
import { useSwal } from "@/hooks/use-swal";



const getStatusColor = (status: ExpenseStatus) => {
  if (status === "PAID") return "green";
  if (status === "CANCELLED") return "red";
  return "orange";
};

const ExpensesList = () => {
  const router = useRouter();
  const swal = useSwal();

  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'ALL'>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const limit = 10;

  const {
    data: expenses,
    isLoading,
    isFetching,
  } = useExpenseQuery(businessId, {
    page: currentPage,
    limit,
    search,
    ...(statusFilter === "ALL" ? {} : { status: statusFilter }),
  });

  const { removeExpense, updateExpensePay, updateExpenseCancel } = useExpenseMutation(businessId);

  const total = expenses?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // all action
  const handleDelete = (id: string) => {
    swal.modal.confirm({
      title: "Delete expense?",
      content: "Are you sure you want to delete this expense?",
      okText: "Delete",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          await removeExpense.mutateAsync(id);
          swal.success("Expense deleted successfully");
        } catch (error) {
          swal.error(getApiErrorMessage(error));
        }
      },
    });
  };

  const handleMarkAsPaid = (id: string) => {
  swal.modal.confirm({
    title: "Mark expense as paid?",
    content: "This expense will be marked as paid.",
    okText: "Mark as Paid",
    cancelText: "Cancel",
    centered: true,
    async onOk() {
      try {
        const res = await updateExpensePay.mutateAsync(id);
        console.log('res', res);
        swal.success("Expense marked as paid successfully");
      } catch (error) {
        swal.error(getApiErrorMessage(error));
      }
    },
  });
};

const handleCancel = (id: string) => {
  swal.modal.confirm({
    title: "Cancel expense?",
    content: "This expense will be cancelled.",
    okText: "Cancel Expense",
    cancelText: "Close",
    centered: true,
    okButtonProps: {
      danger: true,
    },
    async onOk() {
      try {
        await updateExpenseCancel.mutateAsync(id);
        swal.success("Expense cancelled successfully");
      } catch (error) {
        swal.error(getApiErrorMessage(error));
      }
    },
  });
};

  const columns: Column<ExpenseResponse>[] = [
    {
      key: "expenseNo",
      label: "Expense No",
      type: "primary",
      render: (row) => <strong>{row.expenseNo}</strong>,
    },
    {
      key: "title",
      label: "Title",
      render: (row) => row.title,
    },
    {
      key: "account",
      label: "Account",
      render: (row) => row.account?.name ?? "-",
    },
    {
      key: "category",
      label: "Category",
      render: (row) => row.category?.name ?? "-",
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) =>
        `${row.account?.currencyCode ?? "BDT"} ${Number(row.amount).toLocaleString()}`,
    },
    {
      key: "expenseDate",
      label: "Expense Date",
      render: (row) => new Date(row.expenseDate).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={getStatusColor(row.status)}>
          {row.status}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            icon: <Eye />,
            label: "View",
          },
          {
            key: "edit",
            icon: <Pencil />,
            label: "Edit",
          },
          {
            type: "divider",
          },
          {
            key: "paid",
            icon: <CircleCheck />,
            label: "Mark as Paid",
            disabled: row.status === "PAID" || row.status === "CANCELLED",
          },
          {
            key: "cancel",
            icon: <CircleX />,
            label: "Cancel",
            danger: true,
            disabled: row.status === "CANCELLED" || row.status === "PAID",
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            icon: <Trash2 />,
            label: "Delete",
            danger: true,
          },
        ];

        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view") {
            router.push(`/admin/dashboard/finance/expenses/view/${row.id}`);
          }

          if (key === "edit") {
            router.push(`/admin/dashboard/finance/expenses/update/${row.id}`);
          }

          if (key === "paid") {
            handleMarkAsPaid(row.id);
          }

          if (key === "cancel") {
            handleCancel(row.id);
          }

          if (key === "delete") {
            handleDelete(row.id);
          }
        };

        return (
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Tooltip title="Actions">
              <Button
                size="small"
                icon={<MoreHorizontal />}
                onClick={(e) => e.preventDefault()}
              />
            </Tooltip>
          </Dropdown>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Manage business expenses, accounts, categories, amount, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={expenses?.items ?? []}
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          toolbarEnd={
            <div className="flex flex-col gap-3 md:flex-row">
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 180 }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "All", value: "ALL" },
                  { label: "Draft", value: "DRAFT" },
                  { label: "PAID", value: "PAID" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={() =>
                  router.push("/admin/dashboard/finance/expenses/create")
                }
              >
                New Expense
              </Button>
            </div>
          }
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

export default ExpensesList;