"use client";

import { useBrandMutation } from "@/lib/api/hooks/product-brand";
import BrandForm, { BrandFormValues } from "../_components/BrandForm";
import { useAuthStore } from "@/stores/auth.store";
import { BrandPayload } from "@/types/product/brands";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { App } from "antd";

const CreateBrandPage = () => {
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { createBrand } = useBrandMutation(businessId);
  const { message } = App.useApp();

  const handleCreateBrand = async (values: BrandFormValues) => {
    const payload: BrandPayload = {
      name: values.name.trim(),
      description: values.description?.trim() || "",
      logoUrl: values.logoUrl?.trim() || "",
      status: values.status,
      sortOrder: values.sortOrder ?? 0,
    };

    await createBrand.mutateAsync(payload);
    message.success('Brand create successfully');

  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product Brand"
        subtitle="Add a new product brand with logo, description, status, and sorting."
        breadcrumb={adminBreadcrumb}
      />

      <BrandForm
        mode="create"
        onSubmit={handleCreateBrand}
      />
    </div>
  );
};

export default CreateBrandPage;