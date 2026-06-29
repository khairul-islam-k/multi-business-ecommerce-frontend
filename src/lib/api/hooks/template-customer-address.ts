import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { CustomerAddressPayload } from "@/types/template/customer-address";
import { templateCustomerAddressApi } from "../template-customer-address";

export function useCustomerAddressList() {
  return useQuery({
    queryKey: apiQueryKeys.customerAddressTemplate.list(),
    queryFn: () => templateCustomerAddressApi.list(),

  });
}

export function useCustomerAddress(addressId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.customerAddressTemplate.detail(addressId),

    queryFn: () => {
      if (!addressId) {
        throw new Error("Business ID and Category ID are required");
      }

      return templateCustomerAddressApi.get(addressId);
    },

    enabled: Boolean(addressId),
  });
}

export function useTemplateCustomerAddressMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.customerAddressTemplate.all(),
    });

  return {
    createCustomerAddress: useMutation({
      mutationFn: (payload: CustomerAddressPayload) =>
        templateCustomerAddressApi.create(payload),
      onSuccess: invalidate,
    }),

    updateCustomerAddress: useMutation({
      mutationFn: ({
        addressId,
        payload,
      }: {
        addressId: ApiId;
        payload: CustomerAddressPayload;
      }) => templateCustomerAddressApi.update(addressId, payload),
      onSuccess: invalidate,
    }),

    removeCustomerAddress: useMutation({
      mutationFn: (addressId: ApiId) =>
        templateCustomerAddressApi.remove(addressId),
      onSuccess: invalidate,
    }),

  };
}