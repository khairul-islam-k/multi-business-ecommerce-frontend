"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantsApi } from "@/lib/api/tenants";
import { apiQueryKeys } from "@/lib/api/query-keys";
import type {
  ApiId,
  TenantQuery,
  UpdateTenantStatusPayload,
} from "@/lib/api/types";

export function useTenants(query?: TenantQuery) {
  return useQuery({
    queryKey: apiQueryKeys.tenants.list(query),
    queryFn: () => tenantsApi.list(query),
  });
}

export function useTenantMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: apiQueryKeys.tenants.all });

  return {
    updateTenantStatus: useMutation({
      mutationFn: ({
        tenantId,
        payload,
      }: {
        tenantId: ApiId;
        payload: UpdateTenantStatusPayload;
      }) => tenantsApi.updateStatus(tenantId, payload),
      onSuccess: invalidate,
    }),
  };
}
