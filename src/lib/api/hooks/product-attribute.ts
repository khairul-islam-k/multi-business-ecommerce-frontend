import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { productAttributeApi } from "../product-attribute";
import { AttributePayload, AttributeUpdatePayload, AttributeValuePayload } from "@/types/product/attribute";

export function useProductAttribute(businessId: ApiId, productId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductAttribute.detail(businessId, productId),

    queryFn: () => {
      if (!businessId || !productId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productAttributeApi.get(businessId, productId);
    },

    enabled: Boolean(businessId && productId),
  });
}

export function useAttributeMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.ProductAttribute.all(businessId),
    });

  return {
    createAttribute: useMutation({
      mutationFn: ({
        productId,
        payload
      }: {
        productId: ApiId,
        payload: AttributePayload
      }) =>
        productAttributeApi.create(businessId, productId, payload),
      onSuccess: invalidate,
    }),
    createAttributeValue: useMutation({
      mutationFn: ({
        productId,
        attributeId,
        payload
      }: {
        productId: ApiId,
        attributeId: ApiId,
        payload: AttributeValuePayload
      }) =>
        productAttributeApi.createValue(businessId, productId, attributeId, payload),
      onSuccess: invalidate,
    }),

    updateAttributeName: useMutation({
      mutationFn: ({
        productId,
        attributeId,
        payload,
      }: {
        productId: ApiId;
        attributeId: ApiId;
        payload: AttributeUpdatePayload;
      }) => productAttributeApi.update(businessId, productId, attributeId, payload),
      onSuccess: invalidate,
    }),
    updateAttributeValue: useMutation({
      mutationFn: ({
        productId,
        attributeId,
        valueId,
        payload,
      }: {
        productId: ApiId;
        attributeId: ApiId;
        valueId: ApiId;
        payload: AttributeValuePayload;
      }) => productAttributeApi.updateValue(businessId, productId, attributeId, valueId, payload),
      onSuccess: invalidate,
    }),

    removeAttributeName: useMutation({
      mutationFn: ({
        productId,
        attributeId
      }: {
        productId: ApiId;
        attributeId: ApiId;
      }) =>
        productAttributeApi.removeName(businessId, productId, attributeId),
      onSuccess: invalidate,
    }),
    removeAttributeValue: useMutation({
      mutationFn: ({
        productId,
        attributeId,
        valueId,
      }: {
        productId: ApiId;
        attributeId: ApiId;
        valueId: ApiId;
      }) =>
        productAttributeApi.removeValue(businessId, productId, attributeId, valueId),
      onSuccess: invalidate,
    }),

  };
}