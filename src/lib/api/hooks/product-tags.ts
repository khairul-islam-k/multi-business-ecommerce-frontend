import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { UnitPayload } from "@/types/product/unit";
import { productTagApi } from "../product-tags";

export function useProductTagQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.ProductTags.list(businessId, query),
    queryFn: () => productTagApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useTags(businessId: ApiId, tagsId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductTags.detail(businessId, tagsId),

    queryFn: () => {
      if (!businessId || !tagsId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productTagApi.get(businessId, tagsId);
    },

    enabled: Boolean(businessId && tagsId),
  });
}

export function useTagsMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.ProductTags.all(businessId),
    });

  return {
    createTags: useMutation({
      mutationFn: (payload: UnitPayload) =>
        productTagApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateTags: useMutation({
      mutationFn: ({
        tagId,
        payload,
      }: {
        tagId: ApiId;
        payload: UnitPayload;
      }) => productTagApi.update(businessId, tagId, payload),
      onSuccess: invalidate,
    }),

    removeTag: useMutation({
      mutationFn: (tagId: ApiId) =>
        productTagApi.remove(businessId, tagId),
      onSuccess: invalidate,
    }),

  };
}