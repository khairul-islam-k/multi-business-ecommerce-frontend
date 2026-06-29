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

    try {
      setSubmitting(true);

     await createTax.mutateAsync(payload);

      message.success("Tax created successfully");
      router.push("/admin/dashboard/finance/tax");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Tax"
        subtitle="Add a tax rule with a percentage rate, description, and status."
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
