"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { permissionsApi } from "@/lib/api/permissions";
import type { PermissionPayload, PermissionQuery } from "@/lib/api/types";

export function useAvailablePermissions() {
  return useQuery({
    queryKey: apiQueryKeys.permissions.available,
    queryFn: permissionsApi.available,
  });
}

export function usePermissions(businessId?: number, query?: PermissionQuery) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.permissions.list(businessId, query)
      : ["permissions", "idle", query],
    queryFn: () => permissionsApi.list(businessId as number, query),
    enabled: Boolean(businessId),
  });
}

export function useRolePermissions(businessId?: number, roleId?: number) {
  return useQuery({
    queryKey:
      businessId && roleId
        ? apiQueryKeys.permissions.role(businessId, roleId)
        : ["permissions", "role", "idle"],
    queryFn: () =>
      permissionsApi.byRole(businessId as number, roleId as number),
    enabled: Boolean(businessId && roleId),
  });
}

export function usePermissionMutations(businessId: number, roleId: number) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.permissions.role(businessId, roleId),
    });

  return {
    addPermissions: useMutation({
      mutationFn: (payload: PermissionPayload) =>
        permissionsApi.addToRole(businessId, roleId, payload),
      onSuccess: invalidate,
    }),
    replacePermissions: useMutation({
      mutationFn: (payload: PermissionPayload) =>
        permissionsApi.replaceRolePermissions(businessId, roleId, payload),
      onSuccess: invalidate,
    }),
  };
}
