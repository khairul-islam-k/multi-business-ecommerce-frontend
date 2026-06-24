"use client";

import { App } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useProduct, useProductMutation } from "@/lib/api/hooks/product";
import { useVariantMutation } from "@/lib/api/hooks/product-variant";
import { apiQueryKeys } from "@/lib/api/query-keys";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { ProductPayload } from "@/types/product/product";
import {
  BulkUpdateVariantItemPayload,
  ResponseVariant,
  VariantPayload,
} from "@/types/product/variant";
import { useQueryClient } from "@tanstack/react-query";

import ProductForm from "../../_components/product-form";

type ExistingVariantUpdatePayload = BulkUpdateVariantItemPayload & {
  variantId: string;
};

const numberValue = (value?: string | number | null) => Number(value ?? 0);

const getVariantAttributeKey = (
  attributes:
    | Array<{
        attributeId: string;
        attributeValueId: string;
      }>
    | undefined,
) =>
  attributes
    ?.map((attribute) => attribute.attributeValueId)
    .filter(Boolean)
    .sort()
    .join("|") ?? "";

const sameAttributes = (
  current: BulkUpdateVariantItemPayload["attributes"],
  original: ResponseVariant["attributes"],
) => {
  const currentKey = getVariantAttributeKey(current);
  const originalKey = getVariantAttributeKey(
    original?.map((attribute) => ({
      attributeId: attribute.attributeId,
      attributeValueId: attribute.attributeValueId,
    })),
  );

  return currentKey === originalKey;
};

const sameImages = (
  current: BulkUpdateVariantItemPayload["images"],
  original: ResponseVariant["images"],
) => {
  const normalize = (
    images:
      | Array<{
          imageUrl?: string;
          altText?: string;
          isThumbnail?: boolean;
        }>
      | undefined,
  ) =>
    (images ?? [])
      .filter((image) => image.imageUrl)
      .map((image) => ({
        imageUrl: image.imageUrl ?? "",
        altText: image.altText ?? "",
        isThumbnail: Boolean(image.isThumbnail),
      }));

  return (
    JSON.stringify(normalize(current)) === JSON.stringify(normalize(original))
  );
};

const findDuplicateVariantKey = (variants: BulkUpdateVariantItemPayload[]) => {
  const seen = new Set<string>();

  for (const variant of variants) {
    const key = getVariantAttributeKey(variant.attributes);
    if (!key) continue;
    if (seen.has(key)) return key;
    seen.add(key);
  }

  return null;
};

const getChangedExistingVariantPayload = (
  variant: BulkUpdateVariantItemPayload & { variantId: string },
  original?: ResponseVariant,
): ExistingVariantUpdatePayload | null => {
  if (!original) return variant;

  const payload: ExistingVariantUpdatePayload = {
    variantId: variant.variantId,
  };

  if ((variant.title ?? "").trim() !== (original.title ?? "")) {
    payload.title = variant.title?.trim();
  }

  if (
    numberValue(variant.priceOverride) !== numberValue(original.priceOverride)
  ) {
    payload.priceOverride = Number(variant.priceOverride ?? 0);
  }

  if (numberValue(variant.weight) !== numberValue(original.weight)) {
    payload.weight = Number(variant.weight ?? 0);
  }

  if ((variant.status ?? "ACTIVE") !== (original.status ?? "ACTIVE")) {
    payload.status = variant.status;
  }

  if (!sameImages(variant.images, original.images)) {
    payload.images = variant.images ?? [];
  }

  if (!sameAttributes(variant.attributes, original.attributes)) {
    payload.attributes = variant.attributes ?? [];
  }

  return Object.keys(payload).length > 1 ? payload : null;
};

const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ? business?.id : "";
  const { message } = App.useApp();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: product } = useProduct(businessId, id);
  const { updateProduct } = useProductMutation(businessId);
  const { bulkCreateVariants, bulkUpdateVariants, removeVariant } =
    useVariantMutation(businessId);

  const handleUpdateProduct = async (
    values: ProductPayload,
    variants: BulkUpdateVariantItemPayload[],
    deletedVariantIds: string[],
  ) => {
    const duplicateVariantKey = findDuplicateVariantKey(variants);

    if (duplicateVariantKey) {
      message.error("Each variant attribute combination must be unique.");
      return;
    }

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
      await updateProduct.mutateAsync({
        productId: id,
        payload,
      });

      const originalVariants = product?.variants ?? [];
      const originalVariantById = new Map(
        originalVariants.map((variant) => [variant.id, variant]),
      );
      const originalVariantIdByKey = new Map(
        originalVariants.map((variant) => [
          getVariantAttributeKey(
            variant.attributes?.map((attribute) => ({
              attributeId: attribute.attributeId,
              attributeValueId: attribute.attributeValueId,
            })),
          ),
          variant.id,
        ]),
      );
      const deletedVariantIdSet = new Set(deletedVariantIds);
      const resolvedVariants = variants.map((variant) => {
        if (variant.variantId) return variant;

        const existingVariantId = originalVariantIdByKey.get(
          getVariantAttributeKey(variant.attributes),
        );

        if (existingVariantId && !deletedVariantIdSet.has(existingVariantId)) {
          return {
            ...variant,
            variantId: existingVariantId,
          };
        }

        return variant;
      });

      const existingVariants = resolvedVariants
        .filter(
          (
            variant,
          ): variant is BulkUpdateVariantItemPayload & { variantId: string } =>
            Boolean(variant.variantId),
        )
        .map((variant) =>
          getChangedExistingVariantPayload(
            variant,
            originalVariantById.get(variant.variantId),
          ),
        )
        .filter(Boolean) as ExistingVariantUpdatePayload[];
      const newVariants: VariantPayload[] = resolvedVariants
        .filter((variant) => !variant.variantId)
        .map((variant) => ({
          images: variant.images ?? [],
          title: variant.title?.trim() ?? "",
          priceOverride: Number(variant.priceOverride ?? values.price ?? 0),
          weight: Number(variant.weight ?? values.weight ?? 0),
          status: variant.status ?? "ACTIVE",
          attributes: variant.attributes ?? [],
        }));
      if (deletedVariantIds.length) {
        for (const variantId of deletedVariantIds) {
          await removeVariant.mutateAsync({
            productId: id,
            variantId,
          });
        }
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

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: apiQueryKeys.Product.all(businessId),
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: apiQueryKeys.ProductVariant.all(businessId),
          refetchType: "all",
        }),
      ]);

      message.success("Product updated successfully");
      router.push("/admin/dashboard/product-catalog/products");
      router.refresh();
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
