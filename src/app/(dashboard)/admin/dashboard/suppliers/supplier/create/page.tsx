"use client";

import { App } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSupplierMutation } from "@/lib/api/hooks/supplier";
import { useAuthStore } from "@/stores/auth.store";
import { SupplierPayload } from "@/types/suppliers/supplier";

import SupplierForm from "../_components/supplier-form";

export default function CreateSupplierPage() {
  const router = useRouter();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { message } = App.useApp();
  const { createSupplier } = useSupplierMutation(businessId);

  const [submitting, setSubmitting] = useState(false);

  const handleCreateSupplier = async (values: SupplierPayload) => {
    const payload: SupplierPayload = {
      name: values.name?.trim(),
      companyName: values.companyName?.trim(),
      email: values.email?.trim(),
      phone: values.phone?.trim(),
      address: values.address?.trim(),
      city: values.city?.trim(),
      country: values.country?.trim(),
      status: values.status,
      note: values.note?.trim() || "",
    };

    try {
      setSubmitting(true);

      const res = await createSupplier.mutateAsync(payload);

      message.success("Supplier created successfully");
      router.push("/admin/dashboard/suppliers/supplier");
      router.refresh();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to create supplier",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Supplier"
        subtitle="Add a new supplier with company, contact, and address information."
        breadcrumb={adminBreadcrumb}
      />

      <SupplierForm
        mode="create"
        isSubmitting={submitting}
        onSubmit={handleCreateSupplier}
        onCancel={() => router.back()}
      />
    </div>
  );
}
