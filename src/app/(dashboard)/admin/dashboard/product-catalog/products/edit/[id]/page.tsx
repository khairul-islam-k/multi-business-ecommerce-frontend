"use client";

import { useParams } from "next/navigation";
import ProductForm from "../../_components/product-form";
import { useAuthStore } from "@/stores/auth.store";
import { useProduct, useProductMutation } from "@/lib/api/hooks/product";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import { ProductPayload } from "@/types/product/product";
import { App } from "antd";

const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { message } = App.useApp();

  const { data: product } = useProduct(businessId, id);
  const { updateProduct } = useProductMutation(businessId);

  const handleUpdateProduct = async (values: ProductPayload) => {
    const payload: ProductPayload = {
      images: values.images,
      name: values.name.trim(),
      description: values.description?.trim() || "",
      categoryId: values.categoryId,
      brandId: values.brandId,
      unitId: values.unitId,
      status: values.status,
      tagIds: values.tagIds ?? [],
    };

    try {
      await updateProduct.mutateAsync({
        productId: id,
        payload,
      });
      message.success('Update Product successfully');
    } catch (error) {
      message.error(getApiErrorMessage(error));
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
        initialValues={product}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default UpdateProductPage;