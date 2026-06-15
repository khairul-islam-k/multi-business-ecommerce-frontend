import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { ExpenseCategoryApi } from "../expense-category";
import { ExpenseCategoryPayload } from "@/types/stock/expense-category";

export function useExpenseCategoryQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.financeExpenseCategory.list(businessId, query),
    queryFn: () => ExpenseCategoryApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useExpenseCategoryMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.financeExpenseCategory.all(businessId),
    });

  return {
    createExpenseCategory: useMutation({
      mutationFn: (payload: ExpenseCategoryPayload) =>
        ExpenseCategoryApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateExpenseCategory: useMutation({
      mutationFn: ({
        expenseId,
        payload,
      }: {
        expenseId: ApiId;
        payload: ExpenseCategoryPayload;
      }) => ExpenseCategoryApi.update(businessId, expenseId, payload),
      onSuccess: invalidate,
    }),

    removeExpenseCategory: useMutation({
      mutationFn: (expenseId: ApiId) =>
        ExpenseCategoryApi.remove(businessId, expenseId),
      onSuccess: invalidate,
    }),

  };
}