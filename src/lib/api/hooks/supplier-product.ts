import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { SupplierApi } from "../supplier";
import { SupplierProductApi } from "../supplier-product";
import { SupplierProductPayload } from "@/types/suppliers/supplier-product";

export function useSupplierProductsQuery(businessId: ApiId, supplierId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.supplierProduct.list(businessId, supplierId, query),
    queryFn: () => SupplierProductApi.list(businessId, supplierId, query),
    enabled: Boolean(businessId),
  });
}

export function useSupplierProduct(businessId: ApiId, supplierId: ApiId, productMId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.supplierProduct.detail(businessId, supplierId, productMId),

    queryFn: () => {
      if (!businessId || !supplierId || !productMId) {
        throw new Error("Business ID and Category ID are required");
      }

      return SupplierProductApi.get(businessId, supplierId, productMId);
    },

    enabled: Boolean(businessId && supplierId && productMId),
  });
}

export function useSupplierProductMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.supplierProduct.all(businessId),
    });

  return {
    createProduct: useMutation({
      mutationFn: ({
        supplierId,
        payload
      }: {
        supplierId: ApiId,
        payload: SupplierProductPayload
      }) =>
        SupplierProductApi.create(businessId, supplierId, payload),
      onSuccess: invalidate,
    }),

    updateSupplierProduct: useMutation({
      mutationFn: ({
        supplierId,
        productMId,
        payload,
      }: {
        supplierId: ApiId;
        productMId: ApiId;
        payload: SupplierProductPayload;
      }) => SupplierProductApi.update(businessId, supplierId, productMId, payload),
      onSuccess: invalidate,
    }),

    removeSupplierProduct: useMutation({
      mutationFn: ({
        supplierId,
        productMId
      }: {
        supplierId: ApiId;
        productMId: ApiId;
      }) =>
        SupplierProductApi.remove(businessId, supplierId, productMId),
      onSuccess: invalidate,
    }),

  };
}
