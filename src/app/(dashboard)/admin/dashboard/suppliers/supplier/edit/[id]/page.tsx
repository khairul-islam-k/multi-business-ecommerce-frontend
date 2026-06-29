"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useSupplier, useSupplierMutation } from "@/lib/api/hooks/supplier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { SupplierPayload } from "@/types/suppliers/supplier";

import SupplierForm from "../../_components/supplier-form";

const UpdateSupplierPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business.id : "";

  const { message } = App.useApp();

  const { data: supplier } = useSupplier(businessId, id);
  const { updateSupplier } = useSupplierMutation(businessId);

  const handleUpdateSupplier = async (values: SupplierPayload) => {
    setSubmitting(true);
    const payload: SupplierPayload = {
      name: values.name.trim(),
      companyName: values.companyName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      country: values.country.trim(),
      status: values.status,
      note: values.note?.trim() || null,
    };

    try {
      await updateSupplier.mutateAsync({
        supplierId: id,
        payload,
      });

      setSubmitting(false);
      message.success("Supplier updated successfully");
      router.push("/admin/dashboard/suppliers/supplier");
    } catch (error) {
      setSubmitting(false);
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "15px",
        }}
      >
        <PageHeader title="Supplier Update" breadcrumb={adminBreadcrumb} />
      </div>

      <SupplierForm
        mode="update"
        initialValues={supplier}
        isSubmitting={submitting}
        onSubmit={handleUpdateSupplier}
        onCancel={() => router.back()}
      />
    </div>
  );
};

export default UpdateSupplierPage;
