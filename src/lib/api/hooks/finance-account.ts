import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { ProductQuery } from "@/types/product/product";
import { financeAccountApi } from "../finance-account";
import { AddMoneyPayload, FinanceAccountPayload } from "@/types/finance/account";

export function useFinanceAccountQuery(businessId: ApiId, query?: ProductQuery) {
  return useQuery({
    queryKey: apiQueryKeys.financeAccount.list(businessId, query),
    queryFn: () => financeAccountApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useFinanceTransactionQuery(businessId: ApiId, accountId: ApiId, query?: ProductQuery) {
  return useQuery({
    queryKey: apiQueryKeys.financeAccount.listTransaction(businessId, accountId, query),
    queryFn: () => financeAccountApi.listTransaction(businessId, accountId, query),
    enabled: Boolean(businessId),
  });
}

export function useFinanceAccount(businessId: ApiId, accountId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.financeAccount.detail(businessId, accountId),

    queryFn: () => {
      if (!businessId || !accountId) {
        throw new Error("Business ID and Category ID are required");
      }

      return financeAccountApi.get(businessId, accountId);
    },

    enabled: Boolean(businessId && accountId),
  });
}

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

    addMoney: useMutation({
      mutationFn: ({
        accountId,
        payload
      }: {
        accountId: ApiId;
        payload: AddMoneyPayload;
      }) =>
        financeAccountApi.addMoney(businessId, accountId, payload),
      onSuccess: invalidate,
    }),

    updateFinanceAccount: useMutation({
      mutationFn: ({
        accountId,
        payload,
      }: {
        accountId: ApiId;
        payload: FinanceAccountPayload;
      }) => financeAccountApi.update(businessId, accountId, payload),
      onSuccess: invalidate,
    }),

    removeAccount: useMutation({
      mutationFn: (accountId: ApiId) =>
        financeAccountApi.remove(businessId, accountId),
      onSuccess: invalidate,
    }),

  };
}