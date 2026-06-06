import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { purchaseOrderApi } from "../purchase-order";
import { PurchaseOrderPayload } from "@/types/suppliers/purchase-order";

export function usePurchaseOrderQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.purchaseOrder.list(businessId, query),
    queryFn: () => purchaseOrderApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function usePurchaseOrder(businessId: ApiId, purchaseOrderId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.purchaseOrder.detail(businessId, purchaseOrderId),

    queryFn: () => {
      if (!businessId || !purchaseOrderId) {
        throw new Error("Business ID and Category ID are required");
      }

      return purchaseOrderApi.get(businessId, purchaseOrderId);
    },

    enabled: Boolean(businessId && purchaseOrderId),
  });
}

export function usePurchaseOrderMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.purchaseOrder.all(businessId),
    });

  return {
    createPurchaseOrder: useMutation({
      mutationFn: (payload: PurchaseOrderPayload) =>
        purchaseOrderApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    // updateBrand: useMutation({
    //   mutationFn: ({
    //     brandId,
    //     payload,
    //   }: {
    //     brandId: ApiId;
    //     payload: BrandPayload;
    //   }) => productBrandApi.update(businessId, brandId, payload),
    //   onSuccess: invalidate,
    // }),

    removePurchaseOrder: useMutation({
      mutationFn: (purchaseId: ApiId) =>
        purchaseOrderApi.remove(businessId, purchaseId),
      onSuccess: invalidate,
    }),

  };
}
