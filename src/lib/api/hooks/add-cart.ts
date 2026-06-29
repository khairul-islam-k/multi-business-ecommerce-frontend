import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { addCartApi } from "../add-cart";
import { AddToCartPayload, UpdateQuantity } from "@/types/template/add-cart";

// export function useProductBrandQuery(businessId: ApiId, query?: CategoriesQuery) {
//   return useQuery({
//     queryKey: apiQueryKeys.ProductBrands.list(businessId, query),
//     queryFn: () => productBrandApi.list(businessId, query),
//     enabled: Boolean(businessId),
//   });
// }

export function useAddCArt() {
  return useQuery({
    queryKey: apiQueryKeys.addCart.detail(),

    queryFn: () => {
      return addCartApi.get();
    },
  });
}

export function useAddActiveCArt() {
  return useQuery({
    queryKey: apiQueryKeys.addCart.detailActive(),

    queryFn: () => {
      return addCartApi.getActiveCart();
    },
  });
}

export function useAddCartMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.addCart.all(),
    });

  return {
    createAddCart: useMutation({
      mutationFn: (payload: AddToCartPayload) =>
        addCartApi.create(payload),
      onSuccess: invalidate,
    }),

    updateQuantity: useMutation({
      mutationFn: ({
        itemId,
        payload,
      }: {
        itemId: ApiId;
        payload: UpdateQuantity;
      }) => addCartApi.updateQuantity(itemId, payload),
      onSuccess: invalidate,
    }),

    removeActiveCartItem : useMutation({
      mutationFn: (ItemId: ApiId) =>
        addCartApi.removeActiveCartItem(ItemId),
      onSuccess: invalidate,
    }),

  };
}