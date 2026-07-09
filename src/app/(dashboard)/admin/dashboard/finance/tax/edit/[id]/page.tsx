"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import Loader from "@/components/shared/loader";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useTax, useTaxMutation } from "@/lib/api/hooks/tax";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { TaxPayload } from "@/types/finance/tax";

import TaxForm from "../../_components/tax-form";

export default function UpdateTaxPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();

  const { data: tax, isLoading, isFetching } = useTax(businessId, id);
  const { updateTax } = useTaxMutation(businessId);

  const [submitting, setSubmitting] = useState(false);

  const handleUpdateTax = async (values: TaxPayload) => {
    setSubmitting(true);
    const payload: TaxPayload = {
      name: values.name.trim(),
      rate: Number(values.rate),
      description: values.description.trim(),
      status: values.status,
    };

    try {
      const res = await updateTax.mutateAsync({
        taxId: id,
        payload,
      });

      message.success("Tax updated successfully");
      router.push("/admin/dashboard/finance/tax");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Tax"
        subtitle="Update the tax name, percentage rate, description, and status."
        breadcrumb={adminBreadcrumb}
      />

      <TaxForm
        mode="update"
        initialValues={tax}
        isSubmitting={submitting}
        onSubmit={handleUpdateTax}
        onCancel={() => router.back()}
      />
    </div>
  );
}
