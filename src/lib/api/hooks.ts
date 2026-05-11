"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth";
import { rolesApi } from "@/lib/api/roles";
import { apiQueryKeys } from "@/lib/api/query-keys";
import { businessesApi } from "@/lib/api/businesses";
import { employeesApi } from "@/lib/api/employees";
import { permissionsApi } from "@/lib/api/permissions";
import type {
  AssignEmployeeRolesPayload,
  BusinessPayload,
  BusinessQuery,
  CreateEmployeePayload,
  EmployeeQuery,
  PermissionPayload,
  PermissionQuery,
  RoleAssignmentQuery,
  RolePayload,
  RoleQuery,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
  UpdateRoleAssignmentPayload,
} from "@/lib/api/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: apiQueryKeys.auth.me,
    queryFn: authApi.me,
  });
}

export function useBusinesses(query?: BusinessQuery) {
  return useQuery({
    queryKey: apiQueryKeys.businesses.list(query),
    queryFn: () => businessesApi.list(query),
  });
}

export function useBusiness(businessId?: number) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.businesses.detail(businessId)
      : ["businesses", "detail", "idle"],
    queryFn: () => businessesApi.get(businessId as number),
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
        businessId: number;
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

export function useEmployees(businessId?: number, query?: EmployeeQuery) {
  return useQuery({
    queryKey: businessId
      ? apiQueryKeys.employees.list(businessId, query)
      : ["employees", "idle", query],
    queryFn: () => employeesApi.list(businessId as number, query),
    enabled: Boolean(businessId),
  });
}

export function useEmployee(businessId?: number, employeeId?: number) {
  return useQuery({
    queryKey:
      businessId && employeeId
        ? apiQueryKeys.employees.detail(businessId, employeeId)
        : ["employees", "detail", "idle"],
    queryFn: () => employeesApi.get(businessId as number, employeeId as number),
    enabled: Boolean(businessId && employeeId),
  });
}

export function useEmployeeMutations(businessId: number) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.employees.all(businessId),
    });

  return {
    createEmployee: useMutation({
      mutationFn: (payload: CreateEmployeePayload) =>
        employeesApi.create(businessId, payload),
      onSuccess: invalidate,
    }),
    updateEmployee: useMutation({
      mutationFn: ({
        employeeId,
        payload,
      }: {
        employeeId: number;
        payload: UpdateEmployeePayload;
      }) => employeesApi.update(businessId, employeeId, payload),
      onSuccess: invalidate,
    }),
    updateEmployeeStatus: useMutation({
      mutationFn: ({
        employeeId,
        payload,
      }: {
        employeeId: number;
        payload: UpdateEmployeeStatusPayload;
      }) => employeesApi.updateStatus(businessId, employeeId, payload),
      onSuccess: invalidate,
    }),
    replaceEmployeeRoles: useMutation({
      mutationFn: ({
        employeeId,
        payload,
      }: {
        employeeId: number;
        payload: AssignEmployeeRolesPayload;
      }) => employeesApi.replaceRoles(businessId, employeeId, payload),
      onSuccess: invalidate,
    }),
    removeEmployee: useMutation({
      mutationFn: (employeeId: number) =>
        employeesApi.remove(businessId, employeeId),
      onSuccess: invalidate,
    }),
  };
}

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
