"use client";

import { useState } from "react";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import TaxForm from "../_components/tax-form";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { TaxPayload } from "@/types/finance/tax";
import { useTaxMutation } from "@/lib/api/hooks/tax";

export default function CreateTaxPage() {
  const router = useRouter();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();
  const { createTax } = useTaxMutation(businessId);

  const [submitting, setSubmitting] = useState(false);

  const handleCreateTax = async (values: TaxPayload) => {
    const payload: TaxPayload = {
      name: values.name.trim(),
      rate: Number(values.rate),
      description: values.description.trim(),
      status: values.status,
    };

    console.log('payload', payload);

    try {
      setSubmitting(true);

     const res = await createTax.mutateAsync(payload);

      console.log('res', res);
      message.success("Tax created successfully");
    //   router.push("/admin/dashboard/product-catalog/taxes");
    } catch (error) {
      message.error(getApiErrorMessage(error));
      console.log(getApiErrorMessage(error))
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Tax"
        subtitle="Add a new tax rate with name, rate, description, and status."
        breadcrumb={adminBreadcrumb}
      />

      <TaxForm
        mode="create"
        isSubmitting={submitting}
        onSubmit={handleCreateTax}
        onCancel={() => router.back()}
      />
    </div>
  );
}