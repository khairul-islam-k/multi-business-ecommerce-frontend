import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { ExpenseCategoryPayload } from "@/types/stock/expense-category";
import { ExpenseApi } from "../expense";
import { ExpensePayload, ExpenseQuery } from "@/types/stock/expense";

export function useExpenseQuery(businessId: ApiId, query?: ExpenseQuery) {
  return useQuery({
    queryKey: apiQueryKeys.financeExpense.list(businessId, query),
    queryFn: () => ExpenseApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useExpense(businessId: ApiId, expenseId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.financeExpense.detail(businessId, expenseId),

    queryFn: () => {
      if (!businessId || !expenseId) {
        throw new Error("Business ID and Category ID are required");
      }

      return ExpenseApi.get(businessId, expenseId);
    },

    enabled: Boolean(businessId && expenseId),
  });
}

export function useExpenseMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.financeExpense.all(businessId),
    });

  return {
    createExpense: useMutation({
      mutationFn: (payload: ExpensePayload) =>
        ExpenseApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateExpense: useMutation({
      mutationFn: ({
        expenseId,
        payload,
      }: {
        expenseId: ApiId;
        payload: ExpensePayload;
      }) => ExpenseApi.update(businessId, expenseId, payload),
      onSuccess: invalidate,
    }),

    updateExpensePay: useMutation({
      mutationFn: (expenseId: ApiId) => ExpenseApi.updatePay(businessId, expenseId),
      onSuccess: invalidate,
    }),

    updateExpenseCancel: useMutation({
      mutationFn: (expenseId: ApiId) => ExpenseApi.updateCancel(businessId, expenseId),
      onSuccess: invalidate,
    }),

    removeExpense: useMutation({
      mutationFn: (expenseId: ApiId) =>
        ExpenseApi.remove(businessId, expenseId),
      onSuccess: invalidate,
    }),

  };
}