import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { productUnitApi } from "../product-unit";
import { UnitPayload } from "@/types/product/unit";

export function useProductUnitQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.ProductUnit.list(businessId, query),
    queryFn: () => productUnitApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useUnit(businessId: ApiId, unitId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.ProductUnit.detail(businessId, unitId),

    queryFn: () => {
      if (!businessId || !unitId) {
        throw new Error("Business ID and Category ID are required");
      }

      return productUnitApi.get(businessId, unitId);
    },

    enabled: Boolean(businessId && unitId),
  });
}

export function useUnitMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.ProductUnit.all(businessId),
    });

  return {
    createUnit: useMutation({
      mutationFn: (payload: UnitPayload) =>
        productUnitApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateUnit: useMutation({
      mutationFn: ({
        unitId,
        payload,
      }: {
        unitId: ApiId;
        payload: UnitPayload;
      }) => productUnitApi.update(businessId, unitId, payload),
      onSuccess: invalidate,
    }),

    removeUnit: useMutation({
      mutationFn: (unitId: ApiId) =>
        productUnitApi.remove(businessId, unitId),
      onSuccess: invalidate,
    }),

  };
}