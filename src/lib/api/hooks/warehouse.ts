import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { warehouseApi } from "../warehouse";
import { WarehousePayload } from "@/types/product/warehouse";

export function useWarehousesQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.warehouse.list(businessId, query),
    queryFn: () => warehouseApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useWarehouse(businessId: ApiId, warehouseId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.warehouse.detail(businessId, warehouseId),

    queryFn: () => {
      if (!businessId || !warehouseId) {
        throw new Error("Business ID and Category ID are required");
      }

      return warehouseApi.get(businessId, warehouseId);
    },

    enabled: Boolean(businessId && warehouseId),
  });
}

export function useWarehouseMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.warehouse.all(businessId),
    });

  return {
    createWarehouse: useMutation({
      mutationFn: (payload: WarehousePayload) =>
        warehouseApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateWarehouse: useMutation({
      mutationFn: ({
        warehouseId,
        payload,
      }: {
        warehouseId: ApiId;
        payload: WarehousePayload;
      }) => warehouseApi.update(businessId, warehouseId, payload),
      onSuccess: invalidate,
    }),

    removeWarehouse: useMutation({
      mutationFn: (warehouseId: ApiId) =>
        warehouseApi.remove(businessId, warehouseId),
      onSuccess: invalidate,
    }),

  };
}
