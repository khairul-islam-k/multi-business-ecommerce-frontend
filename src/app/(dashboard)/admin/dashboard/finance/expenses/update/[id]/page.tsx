"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";
import { useExpense, useExpenseMutation } from "@/lib/api/hooks/expense";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ExpensePayload } from "@/types/stock/expense";

import ExpenseForm from "../../_components/expense-form";

const UpdateExpense = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const swal = useSwal();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: expense, isFetching, isLoading } = useExpense(businessId, id);

  const { updateExpense } = useExpenseMutation(businessId);

  const handleSubmit = async (values: ExpensePayload) => {
    setLoading(true);

    try {
      await updateExpense.mutateAsync({
        expenseId: id,
        payload: values,
      });

      router.push("/admin/dashboard/finance/expenses/");
      swal.success("Expense created successfully.");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Expense"
        subtitle="Modify expense account, category, amount, date, note, and other expense information."
        breadcrumb={adminBreadcrumb}
      />

      <ExpenseForm
        initialData={expense}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default UpdateExpense;
