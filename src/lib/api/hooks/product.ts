import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { ProductPayload, ProductQuery, ResponseProduct } from "@/types/product/product";
import { productApi } from "../product";

export function useProductsQuery(
  businessId: ApiId,
  query?: ProductQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: apiQueryKeys.Product.list(businessId, query),
    queryFn: () => productApi.list(businessId, query),
    enabled: Boolean(businessId) && (options?.enabled ?? true),
  });
}

export function useProduct(businessId: ApiId, productId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.Product.detail(businessId, productId),

    queryFn: () => {
      if (!businessId || !productId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productApi.get(businessId, productId);
    },

    enabled: Boolean(businessId && productId),
  });
}

export function useProductMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.Product.all(businessId),
    });

  return {
    createProduct: useMutation({
      mutationFn: (payload: ProductPayload) =>
        productApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateProduct: useMutation({
      mutationFn: ({
        productId,
        payload,
      }: {
        productId: ApiId;
        payload: ProductPayload;
      }) => productApi.update(businessId, productId, payload),
      onSuccess: (product: ResponseProduct, variables) => {
        queryClient.setQueryData(
          apiQueryKeys.Product.detail(businessId, variables.productId),
          product,
        );

        void invalidate();
      },
    }),

    removeProduct: useMutation({
      mutationFn: (productId: ApiId) =>
        productApi.remove(businessId, productId),
      onSuccess: invalidate,
    }),

  };
}
