import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { ProductCategoryPayload } from "@/types/product/product";
import { productCategoriesApi } from "../product-categories";

export function useProductCategoriesQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.ProductCategories.list(businessId, query),
    queryFn: () => productCategoriesApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useCategory(businessId: ApiId, categoryId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductCategories.detail(businessId, categoryId),

    queryFn: () => {
      if (!businessId || !categoryId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productCategoriesApi.get(businessId, categoryId);
    },

    enabled: Boolean(businessId && categoryId),
  });
}

export function useProductCategoriesMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.ProductCategories.all(businessId),
    });

  return {
    createCategories: useMutation({
      mutationFn: (payload: ProductCategoryPayload) =>
        productCategoriesApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateCategories: useMutation({
      mutationFn: ({
        categoryId,
        payload,
      }: {
        categoryId: ApiId;
        payload: ProductCategoryPayload;
      }) => productCategoriesApi.update(businessId, categoryId, payload),
      onSuccess: invalidate,
    }),

    removeCategories: useMutation({
      mutationFn: (categoryId: ApiId) =>
        productCategoriesApi.remove(businessId, categoryId),
      onSuccess: invalidate,
    }),

  };
}