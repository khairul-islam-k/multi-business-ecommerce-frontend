"use client";

import { useParams, useRouter } from "next/navigation";
import BrandForm, { BrandFormValues } from "../../_components/BrandForm";
import { useBrand, useBrandMutation } from "@/lib/api/hooks/product-brand";
import { useAuthStore } from "@/stores/auth.store";
import { BrandPayload } from "@/types/product/brands";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { App } from "antd";
import { getApiErrorMessage } from "@/lib/axios";

const UpdateBrandPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { message } = App.useApp();
  const router = useRouter();

  const { data: brands } = useBrand(businessId, id);

  const { updateBrand } = useBrandMutation(businessId);

  const handleUpdateBrand = async (values: BrandFormValues) => {
    const payload: BrandPayload = {
      name: values.name.trim(),
      description: values.description?.trim() || "",
      logoUrl: values.logoUrl?.trim() || "",
      status: values.status,
      sortOrder: values.sortOrder ?? 0,
    };

    try {
      const res = await updateBrand.mutateAsync({ brandId: id, payload })
      message.success('Brand update successfully');
      router.push('/admin/dashboard/product-catalog/brands')
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }

  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Product Brand"
        subtitle="Edit brand name, logo, description, status, and sorting."
        breadcrumb={adminBreadcrumb}
      />

      <BrandForm
        mode="update"
        initialValues={brands}
        onSubmit={handleUpdateBrand}
      />
    </div>
  );
};

export default UpdateBrandPage;