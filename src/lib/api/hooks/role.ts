"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { rolesApi } from "@/lib/api/roles";
import type {
  ApiId,
  RoleAssignmentQuery,
  RolePayload,
  RoleQuery,
  UpdateRoleAssignmentPayload,
} from "@/lib/api/types";

export function useRoles(businessId?: ApiId | null, query?: RoleQuery) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.roles.list(businessId, query)
      : ["roles", "idle", query],
    queryFn: () => rolesApi.list(businessId as ApiId, query),
    enabled: Boolean(businessId),
  });
}

export function useRole(businessId?: ApiId | null, roleId?: ApiId) {
  return useQuery({
    queryKey:
      businessId && roleId
        ? apiQueryKeys.roles.detail(businessId, roleId)
        : ["roles", "detail", "idle"],
    queryFn: () => rolesApi.get(businessId as ApiId, roleId as ApiId),
    enabled: Boolean(businessId && roleId),
  });
}

export function useRoleMutations(businessId: ApiId) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.roles.all(businessId),
    });

  return {
    createRole: useMutation({
      mutationFn: (payload: RolePayload) =>
        rolesApi.create(businessId, payload),
      onSuccess: invalidate,
    }),
    updateRole: useMutation({
      mutationFn: ({
        roleId,
        payload,
      }: {
        roleId: ApiId;
        payload: Partial<RolePayload>;
      }) => rolesApi.update(businessId, roleId, payload),
      onSuccess: invalidate,
    }),
    removeRole: useMutation({
      mutationFn: (roleId: ApiId) => rolesApi.remove(businessId, roleId),
      onSuccess: invalidate,
    }),
  };
}

export function useRoleAssignments(
  businessId?: ApiId | null,
  query?: RoleAssignmentQuery,
) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.roles.assignments(businessId, query)
      : ["roles", "assignments", "idle", query],
    queryFn: () => rolesApi.assignments(businessId as ApiId, query),
    enabled: Boolean(businessId),
  });
}

export function useRoleAssignmentMutations(businessId: ApiId) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.roles.all(businessId),
    });

  return {
    assignRole: useMutation({
      mutationFn: ({
        roleId,
        userId,
        expiresAt,
      }: {
        roleId: ApiId;
        userId: ApiId;
        expiresAt?: string;
      }) => rolesApi.assign(businessId, roleId, { userId, expiresAt }),
      onSuccess: invalidate,
    }),
    updateAssignment: useMutation({
      mutationFn: ({
        assignmentId,
        payload,
      }: {
        assignmentId: ApiId;
        payload: UpdateRoleAssignmentPayload;
      }) => rolesApi.updateAssignment(businessId, assignmentId, payload),
      onSuccess: invalidate,
    }),
    revokeAssignment: useMutation({
      mutationFn: (assignmentId: ApiId) =>
        rolesApi.revokeAssignment(businessId, assignmentId),
      onSuccess: invalidate,
    }),
  };
}
