"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { paymentGatewayApi } from "@/lib/api/payment-gateways";
import { apiQueryKeys } from "@/lib/api/query-keys";
import type { ApiId } from "@/lib/api/types";
import type {
  PaymentGatewayConfigQuery,
  PaymentGatewayPayload,
  PaymentGatewayQuery,
  UpdatePaymentGatewayConfigPayload,
} from "@/types/payment-gateway";

export function usePaymentGatewaysQuery(
  businessId: ApiId,
  query?: PaymentGatewayQuery,
) {
  return useQuery({
    queryKey: apiQueryKeys.paymentGateway.gateways(businessId, query),
    queryFn: () => paymentGatewayApi.gateways(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function usePaymentGatewayConfigsQuery(
  businessId: ApiId,
  query?: PaymentGatewayConfigQuery,
) {
  return useQuery({
    queryKey: apiQueryKeys.paymentGateway.configs(businessId, query),
    queryFn: () => paymentGatewayApi.configs(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function usePaymentGatewayConfigMutations(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.paymentGateway.all(businessId),
    });

  return {

    createAllConfig: useMutation({
      mutationFn: (payload: PaymentGatewayPayload) =>
        paymentGatewayApi.createAllConfig(businessId, payload),
      onSuccess: invalidate,
    }),

    updateConfigs: useMutation({
      mutationFn: ({
        payload,
      }: {
        payload: UpdatePaymentGatewayConfigPayload;
      }) => paymentGatewayApi.updateConfig(businessId, payload),
      onSuccess: invalidate,
    }),

    removeConfig: useMutation({
      mutationFn: (configId: ApiId) =>
        paymentGatewayApi.removeConfig(businessId, configId),
      onSuccess: invalidate,
    }),
  };
}
