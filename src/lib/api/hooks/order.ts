"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ordersApi } from "../orders";
import { apiQueryKeys } from "../query-keys";
import type {
  ApiId,
} from "../types";
import type { OrderPayload, OrderPaymentPayload, OrderQuery } from "../orders";

export function useOrdersQuery(businessId: ApiId, query?: OrderQuery) {
  return useQuery({
    queryKey: apiQueryKeys.orders.list(businessId, query),
    queryFn: () => ordersApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useOrder(businessId: ApiId, orderId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.orders.detail(businessId, orderId),
    queryFn: () => ordersApi.get(businessId, orderId),
    enabled: Boolean(businessId && orderId),
  });
}

export function useOrderMutations(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.orders.all(businessId),
    });

  return {
    createOrder: useMutation({
      mutationFn: (payload: OrderPayload) => ordersApi.create(businessId, payload),
      onSuccess: invalidate,
    }),
    addPayment: useMutation({
      mutationFn: ({
        orderId,
        payload,
      }: {
        orderId: ApiId;
        payload: OrderPaymentPayload;
      }) => ordersApi.addPayment(businessId, orderId, payload),
      onSuccess: invalidate,
    }),
    shipOrder: useMutation({
      mutationFn: (orderId: ApiId) => ordersApi.ship(businessId, orderId),
      onSuccess: invalidate,
    }),
    deliverOrder: useMutation({
      mutationFn: (orderId: ApiId) => ordersApi.deliver(businessId, orderId),
      onSuccess: invalidate,
    }),
    cancelOrder: useMutation({
      mutationFn: (orderId: ApiId) => ordersApi.cancel(businessId, orderId),
      onSuccess: invalidate,
    }),
  };
}
