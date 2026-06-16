"use client";

import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Popconfirm, Select, Tag, Tooltip } from "antd";
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

// type ExpenseStatus = "DRAFT" | "APPROVED" | "CANCELLED";
type AccountType = "CASH" | "BANK" | "MOBILE_BANKING";
type ActiveStatus = "ACTIVE" | "INACTIVE";

type ExpenseAccount = {
  id: string;
  businessId: string;
  name: string;
  accountNumber: string;
  accountType: AccountType;
  currencyCode: string;
  openingBalance: string;
  currentBalance: string;
  status: ActiveStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ExpenseCategory = {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Expense = {
  id: string;
  businessId: string;
  accountId: string;
  expenseCategoryId: string;
  expenseNo: string;
  referenceNo: string | null;
  title: string;
  amount: string;
  expenseDate: string;
  note: string | null;
  status: ExpenseStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  account: ExpenseAccount;
  category: ExpenseCategory;
};

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

  const { removeExpense } = useExpenseMutation(businessId);

  const total = expenses?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

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
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View expense">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() =>
                router.push(`/admin/dashboard/finance/expenses/view/${row.id}`)
              }
            />
          </Tooltip>

          <Tooltip title="Edit expense">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/admin/dashboard/finance/expenses/update/${row.id}`)
              }
            />
          </Tooltip>

          <Tooltip title="Delete expense">
            <Button danger size="small"
              onClick={() => handleDelete(row.id)}
              icon={<DeleteOutlined />} />
          </Tooltip>
        </div>
      ),
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
                  { label: "Approved", value: "PAID" },
                  { label: "Cancelled", value: "CANCELLED" },
                ]}
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
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