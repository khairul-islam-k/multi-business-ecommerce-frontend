import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { productBrandApi } from "../product-brand";
import { customerApi } from "../customer";
import { CustomerPayload } from "@/types/customer/customer";

export function useCustomerQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.customer.list(businessId, query),
    queryFn: () => customerApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

// export function useBrand(businessId: ApiId, brandId: ApiId) {
//   return useQuery({
//     queryKey: apiQueryKeys.ProductCategories.detail(businessId, brandId),

//     queryFn: () => {
//       if (!businessId || !brandId) {
//         throw new Error("Business ID and Category ID are required");
//       }

//       return productBrandApi.get(businessId, brandId);
//     },

//     enabled: Boolean(businessId && brandId),
//   });
// }

export function useCustomerMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.customer.all(businessId),
    });

  return {
    createCustomer: useMutation({
      mutationFn: (payload: CustomerPayload) =>
        customerApi.create(businessId, payload),
      onSuccess: invalidate,
    }),

    // updateBrand: useMutation({
    //   mutationFn: ({
    //     brandId,
    //     payload,
    //   }: {
    //     brandId: ApiId;
    //     payload: BrandPayload;
    //   }) => productBrandApi.update(businessId, brandId, payload),
    //   onSuccess: invalidate,
    // }),

    // removeBrand: useMutation({
    //   mutationFn: (brandId: ApiId) =>
    //     productBrandApi.remove(businessId, brandId),
    //   onSuccess: invalidate,
    // }),

  };
}