import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { purchaseOrderApi } from "../purchase-order";
import { Note, PurchaseOrderPayload, PurchaseReturnPayload, UpdatePurchaseOrderPayload } from "@/types/suppliers/purchase-order";
import PurchaseOrderReturn from "@/app/(dashboard)/admin/dashboard/suppliers/purchase-order/return-request/[purchaseId]/page";
import { productPurchaseReturnApi } from "../purchase-order-return";
import PurchaseOrderForm from "@/app/(dashboard)/admin/dashboard/suppliers/purchase-order/create/page";

export function usePurchaseOrderReturnQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.purchaseOrderReturn.list(businessId, query),
    queryFn: () => productPurchaseReturnApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function usePurchaseOrderReturn(businessId: ApiId, returnId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.purchaseOrderReturn.detail(businessId, returnId),

    queryFn: () => {
      if (!businessId || !returnId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productPurchaseReturnApi.get(businessId, returnId);
    },

    enabled: Boolean(businessId && returnId),
  });
}

export function usePurchaseOrderReturnMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.purchaseOrderReturn.all(businessId),
    });

  return {

    updateReturnComplete: useMutation({
      mutationFn: (purchaseId: ApiId) => productPurchaseReturnApi.updateReturnComplete(businessId, purchaseId),
      onSuccess: invalidate,
    }),

    updateReturnCancel: useMutation({
      mutationFn: (purchaseId: ApiId) => productPurchaseReturnApi.updateReturnCancel(businessId, purchaseId),
      onSuccess: invalidate,
    }),

    updateCancelPO: useMutation({
      mutationFn: ({
        purchaseId,
        payload,
      }: {
        purchaseId: ApiId;
        payload: Note;
      }) => purchaseOrderApi.cancelPO(businessId, purchaseId, payload),
      onSuccess: invalidate,
    }),

    removePurchaseOrder: useMutation({
      mutationFn: (purchaseId: ApiId) =>
        purchaseOrderApi.remove(businessId, purchaseId),
      onSuccess: invalidate,
    }),

  };
}
