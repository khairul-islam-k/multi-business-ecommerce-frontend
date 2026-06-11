import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { purchaseOrderApi } from "../purchase-order";
import { TaxPayload } from "@/types/finance/tax";
import { taxApi } from "../tax";

export function useTaxQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tax.list(businessId, query),
    queryFn: () => taxApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useTax(businessId: ApiId, taxId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductCategories.detail(businessId, taxId),

    queryFn: () => {
      if (!businessId || !taxId) {
        throw new Error("Business ID and Category ID are required");
      }

      return taxApi.get(businessId, taxId);
    },

    enabled: Boolean(businessId && taxId),
  });
}

export function useTaxMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.tax.all(businessId),
    });

  return {
    createTax: useMutation({
      mutationFn: (payload: TaxPayload) => taxApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateTax: useMutation({
      mutationFn: ({ taxId, payload }: { taxId: ApiId; payload: TaxPayload }) =>
        taxApi.update(businessId, taxId, payload),
      onSuccess: invalidate,
    }),

    removeTax: useMutation({
      mutationFn: (taxId: ApiId) => taxApi.remove(businessId, taxId),
      onSuccess: invalidate,
    }),
  };
}
