"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useExpenseMutation } from "@/lib/api/hooks/expense";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ExpensePayload } from "@/types/stock/expense";

import ExpenseForm from "../_components/expense-form";

const ExpenseCreate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const swal = useSwal();
  const router = useRouter();

  const { createExpense } = useExpenseMutation(businessId);

  const handleSubmit = async (values: ExpensePayload) => {
    setLoading(true);

    try {
      const res = await createExpense.mutateAsync(values);
      console.log("res", res);
      router.push("/admin/dashboard/finance/expenses/");
      swal.success("Expense created successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Expense"
        subtitle="Add a new business expense with account, category, amount, date, and note."
        breadcrumb={adminBreadcrumb}
      />

      <ExpenseForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default ExpenseCreate;
