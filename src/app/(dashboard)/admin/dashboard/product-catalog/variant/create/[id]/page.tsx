"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useVariantMutation } from "@/lib/api/hooks/product-variant";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { VariantPayload } from "@/types/product/variant";

import VariantForm from "../../_components/variant-form";

const CreateVariantPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";
  const { createVariant } = useVariantMutation(businessId);
  const { message } = App.useApp();
  const [isSubmitting, SetIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateVariant = async (payload: VariantPayload) => {
    SetIsSubmitting(true);
    try {
      const res = await createVariant.mutateAsync({
        productId: id,
        payload,
      });
      message.success("Variant created successfully.");
      SetIsSubmitting(false);
      router.push("/admin/dashboard/product-catalog/variant");
    } catch (error) {
      SetIsSubmitting(false);
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product Variant"
        subtitle="Add a new product variant with title, SKU, barcode, price, weight, images, attributes, and status."
        breadcrumb={adminBreadcrumb}
      />

      <VariantForm
        mode="create"
        productId={id}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateVariant}
      />
    </div>
  );
};

export default CreateVariantPage;
