import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import {
  normalizePaginatedResponse,
  unwrapApiResponse,
} from "@/lib/api/response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  AssignEmployeeRolesPayload,
  CreateEmployeePayload,
  Employee,
  EmployeeQuery,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
} from "@/lib/api/types";

const basePath = (businessId: ApiId) => `/employees/businesses/${businessId}`;

export const employeesApi = {
  list(businessId: ApiId, query?: EmployeeQuery) {
    return api
      .get<ApiPaginatedResponse<Employee>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  create(businessId: ApiId, payload: CreateEmployeePayload) {
    return api
      .post<ApiResponse<Employee>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  get(businessId: ApiId, employeeId: ApiId) {
    return api
      .get<ApiResponse<Employee>>(`${basePath(businessId)}/${employeeId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(
    businessId: ApiId,
    employeeId: ApiId,
    payload: UpdateEmployeePayload,
  ) {
    return api
      .patch<ApiResponse<Employee>>(
        `${basePath(businessId)}/${employeeId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  updateStatus(
    businessId: ApiId,
    employeeId: ApiId,
    payload: UpdateEmployeeStatusPayload,
  ) {
    return api
      .patch<ApiResponse<Employee>>(
        `${basePath(businessId)}/${employeeId}/status`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  replaceRoles(
    businessId: ApiId,
    employeeId: ApiId,
    payload: AssignEmployeeRolesPayload,
  ) {
    return api
      .put<ApiResponse<Employee>>(
        `${basePath(businessId)}/${employeeId}/roles`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, employeeId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${employeeId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },
};
