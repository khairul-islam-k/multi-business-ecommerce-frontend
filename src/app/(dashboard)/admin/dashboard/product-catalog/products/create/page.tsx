"use client";

import { useAuthStore } from "@/stores/auth.store";
import ProductForm from "../_components/product-form";
import { useProductMutation } from "@/lib/api/hooks/product";
import { useVariantMutation } from "@/lib/api/hooks/product-variant";
import { getApiErrorMessage } from "@/lib/axios";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { ProductPayload } from "@/types/product/product";
import { App } from "antd";
import { useState } from "react";
import {
  BulkUpdateVariantItemPayload,
  VariantPayload,
} from "@/types/product/variant";

const CreateProductPage = () => {
  const router = useRouter();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { createProduct } = useProductMutation(businessId);
  const { bulkCreateVariants } = useVariantMutation(businessId);

  const handleCreateProduct = async (
    values: ProductPayload,
    variants: BulkUpdateVariantItemPayload[],
  ) => {
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
      taxId: values.taxId,
      status: values.status,
      tagIds: values.tagIds ?? [],
    };

    try {
      const product = await createProduct.mutateAsync(payload);

      if (variants.length) {
        const createVariants: VariantPayload[] = variants.map((variant) => ({
          images: variant.images ?? [],
          title: variant.title?.trim() ?? "",
          priceOverride: Number(variant.priceOverride ?? values.price ?? 0),
          weight: Number(variant.weight ?? values.weight ?? 0),
          status: variant.status ?? "ACTIVE",
          attributes: variant.attributes ?? [],
        }));

        await bulkCreateVariants.mutateAsync({
          productId: product.id,
          payload: {
            variants: createVariants,
          },
        });
      }

      message.success(
        variants.length
          ? "Product and variants created successfully"
          : "Product created successfully",
      );
      router.push("/admin/dashboard/product-catalog/products");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
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
