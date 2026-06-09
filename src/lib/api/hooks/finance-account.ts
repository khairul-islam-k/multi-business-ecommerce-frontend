import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { ProductPayload, ProductQuery } from "@/types/product/product";
import { productApi } from "../product";
import { financeAccountApi } from "../finance-account";
import { FinanceAccountPayload } from "@/types/finance/account";

// export function useProductsQuery(businessId: ApiId, query?: ProductQuery) {
//   return useQuery({
//     queryKey: apiQueryKeys.Product.list(businessId, query),
//     queryFn: () => productApi.list(businessId, query),
//     enabled: Boolean(businessId),
//   });
// }

// export function useProduct(businessId: ApiId, productId: ApiId) {
//   return useQuery({
//     queryKey: apiQueryKeys.Product.detail(businessId, productId),

//     queryFn: () => {
//       if (!businessId || !productId) {
//         throw new Error("Business ID and Category ID are required");
//       }

//       return productApi.get(businessId, productId);
//     },

//     enabled: Boolean(businessId && productId),
//   });
// }

export function useFinanceAccountMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.financeAccount.all(businessId),
    });

  return {
    createFinanceAccount: useMutation({
      mutationFn: (payload: FinanceAccountPayload) =>
        financeAccountApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    // updateProduct: useMutation({
    //   mutationFn: ({
    //     productId,
    //     payload,
    //   }: {
    //     productId: ApiId;
    //     payload: ProductPayload;
    //   }) => productApi.update(businessId, productId, payload),
    //   onSuccess: invalidate,
    // }),

    // removeProduct: useMutation({
    //   mutationFn: (productId: ApiId) =>
    //     productApi.remove(businessId, productId),
    //   onSuccess: invalidate,
    // }),

  };
}