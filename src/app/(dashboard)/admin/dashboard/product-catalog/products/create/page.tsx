"use client";

import { useAuthStore } from "@/stores/auth.store";
import ProductForm from "../_components/product-form";
import { useProductMutation } from "@/lib/api/hooks/product";
import { getApiErrorMessage } from "@/lib/axios";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { ProductPayload } from "@/types/product/product";
import { App } from "antd";
import { useState } from "react";


const CreateProductPage = () => {
  const router = useRouter();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { createProduct } = useProductMutation(businessId);

  const handleCreateProduct = async (values: ProductPayload) => {
    setIsSubmitting(true);
    const payload: ProductPayload = {
      images: values.images,
      name: values.name.trim(),
      price: values.price,
      weight: values.weight,
      description: values.description?.trim() || "",
      categoryId: values.categoryId,
      brandId: values.brandId,
      unitId: values.unitId,
      status: values.status,
      tagIds: values.tagIds ?? [],
    };

    try {
      const res = await createProduct.mutateAsync(payload)
      message.success('product created successfully');
      router.push("/admin/dashboard/product-catalog/products");
      setIsSubmitting(false)
      console.log('res', res)
    } catch (error) {
      message.error(getApiErrorMessage(error));
      setIsSubmitting(false);
    }

  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Product"
        subtitle="Add a new product with images, category, brand, unit, status, and tags."
        breadcrumb={adminBreadcrumb}
      />

      <ProductForm
        isSubmitting={isSubmitting}
        mode="create"
        onSubmit={handleCreateProduct}
      />
    </div>
  );
};

export default CreateProductPage;