import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { BrandPayload } from "@/types/product/brands";
import { productStockApi } from "../stock";
import { LowStockAlertFormValues } from "@/types/stock/stock";

export function useProductStockQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.productStock.list(businessId, query),
    queryFn: () => productStockApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useProductStockMovementQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.productStock.movementList(businessId, query),
    queryFn: () => productStockApi.movementList(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useStock(businessId: ApiId, stockId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.productStock.detail(businessId, stockId),

    queryFn: () => {
      if (!businessId || !stockId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productStockApi.get(businessId, stockId);
    },

    enabled: Boolean(businessId && stockId),
  });
}

export function useProductStockMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.productStock.all(businessId),
    });

  return {
    updateLowAlert: useMutation({
      mutationFn: ({
        stockId,
        payload,
      }: {
        stockId: ApiId;
        payload: LowStockAlertFormValues;
      }) => productStockApi.updateLowAlert(businessId, stockId, payload),
      onSuccess: invalidate,
    })

  };
}