import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { BrandPayload } from "@/types/product/brands";
import { purchaseOrderApi } from "../purchase-order";
import { PurchaseOrderPayload } from "@/types/suppliers/purchase-order";

export function usePurchaseOrderQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.purchaseOrder.list(businessId, query),
    queryFn: () => purchaseOrderApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

// export function useBrand(businessId: ApiId, brandId: ApiId) {
//   return useQuery({
//     queryKey: apiQueryKeys.ProductCategories.detail(businessId, brandId),

//     queryFn: () => {
//       if (!businessId || !brandId) {
//         throw new Error("Business ID and Category ID are required");
//       }

//       return productBrandApi.get(businessId, brandId);
//     },

//     enabled: Boolean(businessId && brandId),
//   });
// }

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

    // removeBrand: useMutation({
    //   mutationFn: (brandId: ApiId) =>
    //     productBrandApi.remove(businessId, brandId),
    //   onSuccess: invalidate,
    // }),

  };
}
