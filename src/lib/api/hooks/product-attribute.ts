import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { productAttributeApi } from "../product-attribute";
import { AttributePayload, AttributeUpdatePayload, AttributeValuePayload } from "@/types/product/attribute";

export function useProductAttributeQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.ProductAttribute.list(businessId, query),
    queryFn: () => productAttributeApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useAttribute(businessId: ApiId, attributeId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductAttribute.detail(businessId, attributeId),

    queryFn: () => {
      if (!businessId || !attributeId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productAttributeApi.get(businessId, attributeId);
    },

    enabled: Boolean(businessId && attributeId),
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
      mutationFn: (payload: AttributePayload) =>
        productAttributeApi.create(businessId, payload),
      onSuccess: invalidate,
    }),
    createAttributeValue: useMutation({
      mutationFn: ({
        attributeId,
        payload
      }: {
        attributeId: ApiId,
        payload: AttributeValuePayload
      }) =>
        productAttributeApi.createValue(businessId, attributeId, payload),
      onSuccess: invalidate,
    }),

    updateAttributeName: useMutation({
      mutationFn: ({
        attributeId,
        payload,
      }: {
        attributeId: ApiId;
        payload: AttributeUpdatePayload;
      }) => productAttributeApi.update(businessId, attributeId, payload),
      onSuccess: invalidate,
    }),
    updateAttributeValue: useMutation({
      mutationFn: ({
        attributeId,
        valueId,
        payload,
      }: {
        attributeId: ApiId;
        valueId: ApiId;
        payload: AttributeValuePayload;
      }) => productAttributeApi.updateValue(businessId, attributeId, valueId, payload),
      onSuccess: invalidate,
    }),

    removeAttributeName: useMutation({
      mutationFn: (attributeId: ApiId) =>
        productAttributeApi.removeName(businessId, attributeId),
      onSuccess: invalidate,
    }),
    removeAttributeValue: useMutation({
      mutationFn: ({
        attributeId,
        valueId,
      }: {
        attributeId: ApiId;
        valueId: ApiId;
      }) =>
        productAttributeApi.removeValue(businessId, attributeId, valueId),
      onSuccess: invalidate,
    }),

  };
}