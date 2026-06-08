import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { productVariantApi } from "../product-variant";
import {
  BulkUpdateVariantPayload,
  BulkVariantPayload,
  VariantPayload,
} from "@/types/product/variant";

export function useProductVariantQuery(businessId: ApiId, productId: ApiId, search: string) {
  return useQuery({
    queryKey: apiQueryKeys.ProductVariant.list(businessId, productId, search),
    queryFn: () => productVariantApi.list(businessId, productId, search),
    enabled: Boolean(businessId),
  });
}

export function useVariant(businessId: ApiId, productId: ApiId, variantId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductVariant.detail(businessId, productId, variantId),

    queryFn: () => {
      if (!businessId || !productId || !variantId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productVariantApi.get(businessId, productId, variantId);
    },

    enabled: Boolean(businessId && productId && variantId),
  });
}

export function useVariantMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.ProductVariant.all(businessId),
    });

  return {
    createVariant: useMutation({
      mutationFn: ({
        productId,
        payload
      }: {
        productId: ApiId,
        payload: VariantPayload
      }) =>
        productVariantApi.create(businessId, productId, payload),
      onSuccess: invalidate,
    }),

    bulkCreateVariants: useMutation({
      mutationFn: ({
        productId,
        payload
      }: {
        productId: ApiId,
        payload: BulkVariantPayload
      }) =>
        productVariantApi.bulkCreate(businessId, productId, payload),
      onSuccess: invalidate,
    }),

    bulkUpdateVariants: useMutation({
      mutationFn: ({
        productId,
        payload
      }: {
        productId: ApiId,
        payload: BulkUpdateVariantPayload
      }) =>
        productVariantApi.bulkUpdate(businessId, productId, payload),
      onSuccess: invalidate,
    }),

    updateVariant: useMutation({
      mutationFn: ({
        productId,
        variantId,
        payload,
      }: {
        productId: ApiId;
        variantId: ApiId;
        payload: VariantPayload;
      }) => productVariantApi.update(businessId, productId, variantId, payload),
      onSuccess: invalidate,
    }),

    removeVariant: useMutation({
      mutationFn: ({
        productId,
        variantId
      }: {
        productId: ApiId;
        variantId: ApiId;
      }) =>
        productVariantApi.remove(businessId, productId, variantId),
      onSuccess: invalidate,
    }),

  };
}
