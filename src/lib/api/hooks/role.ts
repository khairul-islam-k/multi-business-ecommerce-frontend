"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { rolesApi } from "@/lib/api/roles";
import type {
  RoleAssignmentQuery,
  RolePayload,
  RoleQuery,
  UpdateRoleAssignmentPayload,
} from "@/lib/api/types";

export function useRoles(businessId?: number, query?: RoleQuery) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.roles.list(businessId, query)
      : ["roles", "idle", query],
    queryFn: () => rolesApi.list(businessId as number, query),
    enabled: Boolean(businessId),
  });
}

export function useRole(businessId?: number, roleId?: number) {
  return useQuery({
    queryKey:
      businessId && roleId
        ? apiQueryKeys.roles.detail(businessId, roleId)
        : ["roles", "detail", "idle"],
    queryFn: () => rolesApi.get(businessId as number, roleId as number),
    enabled: Boolean(businessId && roleId),
  });
}

export function useRoleMutations(businessId: number) {
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
        roleId: number;
        payload: Partial<RolePayload>;
      }) => rolesApi.update(businessId, roleId, payload),
      onSuccess: invalidate,
    }),
    removeRole: useMutation({
      mutationFn: (roleId: number) => rolesApi.remove(businessId, roleId),
      onSuccess: invalidate,
    }),
  };
}

export function useRoleAssignments(
  businessId?: number,
  query?: RoleAssignmentQuery,
) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.roles.assignments(businessId, query)
      : ["roles", "assignments", "idle", query],
    queryFn: () => rolesApi.assignments(businessId as number, query),
    enabled: Boolean(businessId),
  });
}

export function useRoleAssignmentMutations(businessId: number) {
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
        roleId: number;
        userId: number;
        expiresAt?: string;
      }) => rolesApi.assign(businessId, roleId, { userId, expiresAt }),
      onSuccess: invalidate,
    }),
    updateAssignment: useMutation({
      mutationFn: ({
        assignmentId,
        payload,
      }: {
        assignmentId: number;
        payload: UpdateRoleAssignmentPayload;
      }) => rolesApi.updateAssignment(businessId, assignmentId, payload),
      onSuccess: invalidate,
    }),
    revokeAssignment: useMutation({
      mutationFn: (assignmentId: number) =>
        rolesApi.revokeAssignment(businessId, assignmentId),
      onSuccess: invalidate,
    }),
  };
}
