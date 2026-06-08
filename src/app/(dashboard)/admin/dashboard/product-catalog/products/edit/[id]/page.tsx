"use client";

import { useParams, useRouter } from "next/navigation";
import ProductForm from "../../_components/product-form";
import { useAuthStore } from "@/stores/auth.store";
import { useProduct, useProductMutation } from "@/lib/api/hooks/product";
import { useVariantMutation } from "@/lib/api/hooks/product-variant";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import { ProductPayload } from "@/types/product/product";
import { App } from "antd";
import { useState } from "react";
import {
  BulkUpdateVariantItemPayload,
  VariantPayload,
} from "@/types/product/variant";

const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore(s => s.selectedBusiness);
  const businessId = business?.id ? business?.id : '';
  const { message } = App.useApp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: product } = useProduct(businessId, id);
  const { updateProduct } = useProductMutation(businessId);
  const {
    bulkCreateVariants,
    bulkUpdateVariants,
    removeVariant,
  } = useVariantMutation(businessId);

  const handleUpdateProduct = async (
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
      status: values.status,
      tagIds: values.tagIds ?? [],
    };

    try {
      await updateProduct.mutateAsync({
        productId: id,
        payload,
      });

      const submittedVariantIds = variants
        .map((variant) => variant.variantId)
        .filter(Boolean);
      const removedVariantIds =
        product?.variants
          ?.map((variant) => variant.id)
          .filter((variantId) => !submittedVariantIds.includes(variantId)) ?? [];
      const existingVariants = variants.filter(
        (variant): variant is BulkUpdateVariantItemPayload & { variantId: string } =>
          Boolean(variant.variantId),
      );
      const newVariants: VariantPayload[] = variants
        .filter((variant) => !variant.variantId)
        .map((variant) => ({
          images: variant.images ?? [],
          title: variant.title?.trim() ?? "",
          priceOverride: Number(variant.priceOverride ?? values.price ?? 0),
          weight: Number(variant.weight ?? values.weight ?? 0),
          status: variant.status ?? "ACTIVE",
          attributes: variant.attributes ?? [],
        }));

      if (removedVariantIds.length) {
        await Promise.all(
          removedVariantIds.map((variantId) =>
            removeVariant.mutateAsync({
              productId: id,
              variantId,
            }),
          ),
        );
      }

      if (existingVariants.length) {
        await bulkUpdateVariants.mutateAsync({
          productId: id,
          payload: {
            variants: existingVariants,
          },
        });
      }

      if (newVariants.length) {
        await bulkCreateVariants.mutateAsync({
          productId: id,
          payload: {
            variants: newVariants,
          },
        });
      }

      message.success('Product updated successfully');
      router.push("/admin/dashboard/product-catalog/products");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
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
