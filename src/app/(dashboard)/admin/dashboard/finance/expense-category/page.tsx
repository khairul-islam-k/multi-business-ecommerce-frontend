"use client";

import {
  CirclePlus,
  Pencil,
  Trash2
} from "lucide-react";


import React, { useState } from "react";
import { Button, Card, FormInstance, Modal, Popconfirm, Select, Tag } from "antd";

import ExpenseCategoryForm from "./_components/expense-category-form";
import PageHeader from "@/components/shared/page-header";
import { Column, DataTable } from "@/components/shared/data-table";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

import {
  ExpenseCategoryResponse,
  ExpenseCategoryPayload,
  ExpenseCategoryStatus,
} from "@/types/stock/expense-category";

import {
  useExpenseCategoryMutation,
  useExpenseCategoryQuery,
} from "@/lib/api/hooks/expense-category";

import { useAuthStore } from "@/stores/auth.store";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";

type ModalMode = "create" | "update" | "view";

const ExpenseCategories = () => {
  const swal = useSwal();

  const [loading, setLoading] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [mode, setMode] = useState<ModalMode>("create");

  const [selectedExpenseCategory, setSelectedExpenseCategory] =
    useState<ExpenseCategoryResponse | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<ExpenseCategoryStatus | undefined>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const limit = 10;

  const {
    data: expenseCategories,
    isLoading,
    isFetching,
  } = useExpenseCategoryQuery(businessId, {
    page: currentPage,
    limit,
    search,
    status: statusFilter
  });

  const {
    createExpenseCategory,
    updateExpenseCategory,
    removeExpenseCategory,
  } = useExpenseCategoryMutation(businessId);

  const total = expenseCategories?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const openCreateModal = () => {
    setMode("create");
    setModalTitle("Create Expense Category");
    setSelectedExpenseCategory(null);
    setShowViewModal(true);
  };

  const openUpdateModal = (row: ExpenseCategoryResponse) => {
    setMode("update");
    setModalTitle("Update Expense Category");
    setSelectedExpenseCategory(row);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowViewModal(false);
    setSelectedExpenseCategory(null);
  };

  const initialValues: ExpenseCategoryPayload | undefined =
    selectedExpenseCategory
      ? {
          name: selectedExpenseCategory.name,
          description: selectedExpenseCategory.description ?? "",
          status: selectedExpenseCategory.status,
        }
      : undefined;

  const handleCreateExpenseCategory = async (
    values: ExpenseCategoryPayload,
    form: FormInstance<ExpenseCategoryPayload>
  ) => {
    setLoading(true);

    const payload: ExpenseCategoryPayload = {
      name: values.name,
      description: values.description,
      status: values.status,
    };

    try {
      await createExpenseCategory.mutateAsync(payload);

      form.resetFields();
      closeModal();

      swal.success("Expense category created successfully");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpenseCategory = async (
    values: ExpenseCategoryPayload,
    form: FormInstance<ExpenseCategoryPayload>
  ) => {
    if (!selectedExpenseCategory) return;

    setLoading(true);

    const payload: ExpenseCategoryPayload = {
      name: values.name,
      description: values.description,
      status: values.status,
    };

    try {
      await updateExpenseCategory.mutateAsync({
        expenseId: selectedExpenseCategory.id,
        payload
      });
      
      closeModal();

      swal.success("Expense category updated successfully");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpenseCategory = async (id: string) => {
    try {
      await removeExpenseCategory.mutateAsync(id);
      swal.success("Expense category deleted successfully");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  const columns: Column<ExpenseCategoryResponse>[] = [
    {
      key: "name",
      label: "Category Name",
      type: "primary",
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: "description",
      label: "Description",
      render: (row) => row.description || "-",
    },
    {
      key: "status",
      label: "Status",
      type: "meta",
      render: (row) => (
        <Tag color={row.status === "ACTIVE" ? "green" : "red"}>
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

          <Button
            size="small"
            icon={<Pencil />}
            onClick={() => openUpdateModal(row)}
          />

          <Popconfirm
            title="Delete expense category?"
            description="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteExpenseCategory(row.id)}
          >
            <Button danger size="small" icon={<Trash2 />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Categories"
        subtitle="Manage expense categories, descriptions, and status."
        breadcrumb={adminBreadcrumb}
      />

      <Card>
        <DataTable
          data={expenseCategories?.items ?? []}
          columns={columns}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          loading={isLoading || isFetching}
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
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />

              <Button
                type="primary"
                icon={<CirclePlus />}
                onClick={openCreateModal}
              >
                New Expense Category
              </Button>
            </div>
          }
          pagination={{
            currentPage,
            onPageChange: setCurrentPage,
            totalPages,
          }}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={showViewModal}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <ExpenseCategoryForm
          mode={mode}
          loading={loading}
          initialValues={initialValues}
          onSubmit={
            mode === "create"
              ? handleCreateExpenseCategory
              : handleUpdateExpenseCategory
          }
        />
      </Modal>
    </div>
  );
};

export default ExpenseCategories;