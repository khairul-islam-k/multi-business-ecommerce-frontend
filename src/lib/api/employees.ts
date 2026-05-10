import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import type {
  AssignEmployeeRolesPayload,
  CreateEmployeePayload,
  Employee,
  EmployeeQuery,
  MessageResponse,
  PaginatedResponse,
  UpdateEmployeePayload,
  UpdateEmployeeStatusPayload,
} from "@/lib/api/types";

const basePath = (businessId: number) => `/employees/businesses/${businessId}`;

export const employeesApi = {
  list(businessId: number, query?: EmployeeQuery) {
    return api
      .get<PaginatedResponse<Employee>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => res.data);
  },

  create(businessId: number, payload: CreateEmployeePayload) {
    return api
      .post<Employee>(basePath(businessId), payload)
      .then((res) => res.data);
  },

  get(businessId: number, employeeId: number) {
    return api
      .get<Employee>(`${basePath(businessId)}/${employeeId}`)
      .then((res) => res.data);
  },

  update(
    businessId: number,
    employeeId: number,
    payload: UpdateEmployeePayload,
  ) {
    return api
      .patch<Employee>(`${basePath(businessId)}/${employeeId}`, payload)
      .then((res) => res.data);
  },

  updateStatus(
    businessId: number,
    employeeId: number,
    payload: UpdateEmployeeStatusPayload,
  ) {
    return api
      .patch<Employee>(`${basePath(businessId)}/${employeeId}/status`, payload)
      .then((res) => res.data);
  },

  replaceRoles(
    businessId: number,
    employeeId: number,
    payload: AssignEmployeeRolesPayload,
  ) {
    return api
      .put<Employee>(`${basePath(businessId)}/${employeeId}/roles`, payload)
      .then((res) => res.data);
  },

  remove(businessId: number, employeeId: number) {
    return api
      .delete<MessageResponse>(`${basePath(businessId)}/${employeeId}`)
      .then((res) => res.data);
  },
};
