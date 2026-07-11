import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { SupplierApi } from "../supplier";
import { SupplierPayload } from "@/types/suppliers/supplier";

export function useSuppliersQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.supplier.list(businessId, query),
    queryFn: () => SupplierApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useSupplier(businessId: ApiId, supplierId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.supplier.detail(businessId, supplierId),

    queryFn: () => {
      if (!businessId || !supplierId) {
        throw new Error("Business ID and Category ID are required");
      }

      return SupplierApi.get(businessId, supplierId);
    },

    enabled: Boolean(businessId && supplierId),
  });
}

export function useSupplierMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.supplier.all(businessId),
    });

  return {
    createSupplier: useMutation({
      mutationFn: (payload: SupplierPayload) =>
        SupplierApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    updateSupplier: useMutation({
      mutationFn: ({
        supplierId,
        payload,
      }: {
        supplierId: ApiId;
        payload: SupplierPayload;
      }) => SupplierApi.update(businessId, supplierId, payload),
      onSuccess: invalidate,
    }),

    removeSupplier: useMutation({
      mutationFn: (supplierId: ApiId) =>
        SupplierApi.remove(businessId, supplierId),
      onSuccess: invalidate,
    }),

  };
}
