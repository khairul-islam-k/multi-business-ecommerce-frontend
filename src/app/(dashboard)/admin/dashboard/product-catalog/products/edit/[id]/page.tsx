"use client";

import { useParams, useRouter } from "next/navigation";
import ProductForm from "../../_components/product-form";
import { useAuthStore } from "@/stores/auth.store";
import { useProduct, useProductMutation } from "@/lib/api/hooks/product";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import { ProductPayload } from "@/types/product/product";
import { App } from "antd";
import { useState } from "react";

const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { message } = App.useApp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: product } = useProduct(businessId, id);
  const { updateProduct } = useProductMutation(businessId);

  const handleUpdateProduct = async (values: ProductPayload) => {
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

    console.log('payload', payload);


    try {
      await updateProduct.mutateAsync({
        productId: id,
        payload,
      });
      message.success('Product updated successfully');
      router.push("/admin/dashboard/product-catalog/products");
      setIsSubmitting(false)
    } catch (error) {
      message.error(getApiErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Update Product"
        subtitle="Edit product information, images, category, brand, unit, tags, and product status."
        breadcrumb={adminBreadcrumb}
      />

      <ProductForm
        mode="update"
        isSubmitting={isSubmitting}
        initialValues={product}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default UpdateProductPage;