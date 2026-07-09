import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { addCartApi } from "../add-cart";
import { AddToCartPayload, CartQuery, UpdateQuantity } from "@/types/template/add-cart";

export function useCartListQuery(query?: CartQuery) {
  return useQuery({
    queryKey: apiQueryKeys.addCart.list(query),
    queryFn: () => addCartApi.listCart(query),
  });
}

export function useAddCArt() {
  return useQuery({
    queryKey: apiQueryKeys.addCart.detail(),

    queryFn: () => {
      return addCartApi.get();
    },
  });
}

export function useOldCart(cartId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.addCart.detailOldCart(cartId),

    queryFn: () => {
      return addCartApi.getOldCart(cartId);
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