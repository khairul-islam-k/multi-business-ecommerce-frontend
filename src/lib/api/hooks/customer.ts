import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { customerApi } from "../customer";
import { CustomerPayload } from "@/types/customer/customer";

export function useCustomerQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.customer.list(businessId, query),
    queryFn: () => customerApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useCustomer(businessId: ApiId, customerId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.customer.detail(businessId, customerId),

    queryFn: () => {
      if (!businessId || !customerId) {
        throw new Error("Business ID and Category ID are required");
      }

      return customerApi.get(businessId, customerId);
    },

    enabled: Boolean(businessId && customerId),
  });
}

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

    updateCustomer: useMutation({
      mutationFn: ({
        customerId,
        payload,
      }: {
        customerId: ApiId;
        payload: CustomerPayload;
      }) => customerApi.update(businessId, customerId, payload),
      onSuccess: invalidate,
    }),

    removeCustomer: useMutation({
      mutationFn: (customerId: ApiId) =>
        customerApi.remove(businessId, customerId),
      onSuccess: invalidate,
    }),

  };
}