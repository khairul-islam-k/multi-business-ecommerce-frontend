import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { customerAddressApi } from "../customer-address";
import { CustomerAddressPayload } from "@/types/customer/customerAddress";


export function useCustomerAddressMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidateAddress = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.customerAddress.all(businessId),
      }),

      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.customer.all(businessId),
      }),
    ]);
  };

  return {
    createAddress: useMutation({
      mutationFn: ({
        customerId,
        payload
      }: {
        customerId: ApiId;
        payload: CustomerAddressPayload
      }) =>
        customerAddressApi.create(businessId, customerId, payload),
      onSuccess: async () => {
        await invalidateAddress()
      },
    }),

    updateAddress: useMutation({
      mutationFn: ({
        customerId,
        addressId,
        payload,
      }: {
        customerId: ApiId;
        addressId: ApiId;
        payload: CustomerAddressPayload;
      }) => customerAddressApi.update(businessId, customerId, addressId, payload),
      onSuccess: async () => {
        await invalidateAddress()
      },
    }),

    removeAddress: useMutation({
      mutationFn: ({
        customerId,
        addressId
      }:{
        customerId: ApiId;
        addressId: ApiId;
      }) =>
        customerAddressApi.remove(businessId, customerId, addressId),
      onSuccess: async () => {
        await invalidateAddress()
      },
    }),

  };
}