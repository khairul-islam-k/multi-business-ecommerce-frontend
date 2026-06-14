import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { financePayableReceivableApi } from "../finance-payable-receivable";
import { PayableQuery, PayPayableFormValues, ReceivableQuery, ReceiveReceivableFormValues } from "@/types/finance/payable";

export function useFinancePayableQuery(businessId: ApiId, query?: PayableQuery) {
  return useQuery({
    queryKey: apiQueryKeys.financePayable.list(businessId, query),
    queryFn: () => financePayableReceivableApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useFinanceReceivableQuery(businessId: ApiId, query?: ReceivableQuery) {
  return useQuery({
    queryKey: apiQueryKeys.financeReceivable.list(businessId, query),
    queryFn: () => financePayableReceivableApi.listReceivable(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useFinancePayable(businessId: ApiId, PayableId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.financePayable.detail(businessId, PayableId),

    queryFn: () => {
      if (!businessId || !PayableId) {
        throw new Error("Business ID and Category ID are required");
      }

      return financePayableReceivableApi.getPayable(businessId, PayableId);
    },

    enabled: Boolean(businessId && PayableId),
  });
}

export function useFinanceReceivable(businessId: ApiId, receivableId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.financeReceivable.detail(businessId, receivableId),

    queryFn: () => {
      if (!businessId || !receivableId) {
        throw new Error("Business ID and Category ID are required");
      }

      return financePayableReceivableApi.getReceivable(businessId, receivableId);
    },

    enabled: Boolean(businessId && receivableId),
  });
}

export function useFinancePayableMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.financePayable.all(businessId),
    });

  return {

    updateFinancePayable: useMutation({
      mutationFn: ({
        payableId,
        payload,
      }: {
        payableId: ApiId;
        payload: PayPayableFormValues;
      }) => financePayableReceivableApi.updatePayable(businessId, payableId, payload),
      onSuccess: invalidate,
    }),

  };
}

export function useFinanceReceivableMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.financeReceivable.all(businessId),
    });

  return {

    updateFinanceReceivable: useMutation({
      mutationFn: ({
        receivableId,
        payload,
      }: {
        receivableId: ApiId;
        payload: ReceiveReceivableFormValues;
      }) => financePayableReceivableApi.updateReceivable(businessId, receivableId, payload),
      onSuccess: invalidate,
    }),

  };
}