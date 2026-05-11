"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "@/lib/api/query-keys";
import { employeesApi } from "@/lib/api/employees";
import type {
  AssignEmployeeRolesPayload,
  CreateEmployeePayload,
  EmployeeQuery,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
} from "@/lib/api/types";

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
