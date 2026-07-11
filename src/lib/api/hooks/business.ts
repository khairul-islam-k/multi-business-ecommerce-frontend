"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { businessesApi } from "@/lib/api/businesses";
import type { ApiId, BusinessPayload, BusinessQuery } from "@/lib/api/types";

export function useBusinesses(query?: BusinessQuery) {
  return useQuery({
    queryKey: apiQueryKeys.businesses.list(query),
    queryFn: () => businessesApi.list(query),
  });
}

export function useBusiness(businessId?: ApiId | null) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.businesses.detail(businessId)
      : ["businesses", "detail", "idle"],
    queryFn: () => businessesApi.get(businessId as ApiId),
    enabled: Boolean(businessId),
  });
}

export function useBusinessMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: apiQueryKeys.businesses.all });

  return {
    createBusiness: useMutation({
      mutationFn: (payload: BusinessPayload) => businessesApi.create(payload),
      onSuccess: invalidate,
    }),
    updateBusiness: useMutation({
      mutationFn: ({
        businessId,
        payload,
      }: {
        businessId: ApiId;
        payload: Partial<BusinessPayload>;
      }) => businessesApi.update(businessId, payload),
      onSuccess: invalidate,
    }),
    removeBusiness: useMutation({
      mutationFn: businessesApi.remove,
      onSuccess: invalidate,
    }),
  };
}
