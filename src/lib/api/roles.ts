import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import type {
  AssignRolePayload,
  MessageResponse,
  PaginatedResponse,
  Role,
  RoleAssignment,
  RoleAssignmentQuery,
  RolePayload,
  RoleQuery,
  UpdateRoleAssignmentPayload,
} from "@/lib/api/types";

const basePath = (businessId: number) => `/roles/businesses/${businessId}`;

export const rolesApi = {
  list(businessId: number, query?: RoleQuery) {
    return api
      .get<PaginatedResponse<Role>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => res.data);
  },

  create(businessId: number, payload: RolePayload) {
    return api
      .post<Role>(basePath(businessId), payload)
      .then((res) => res.data);
  },

  get(businessId: number, roleId: number) {
    return api
      .get<Role>(`${basePath(businessId)}/${roleId}`)
      .then((res) => res.data);
  },

  update(businessId: number, roleId: number, payload: Partial<RolePayload>) {
    return api
      .patch<Role>(`${basePath(businessId)}/${roleId}`, payload)
      .then((res) => res.data);
  },

  remove(businessId: number, roleId: number) {
    return api
      .delete<MessageResponse>(`${basePath(businessId)}/${roleId}`)
      .then((res) => res.data);
  },

  assign(businessId: number, roleId: number, payload: AssignRolePayload) {
    return api
      .post<RoleAssignment>(`${basePath(businessId)}/${roleId}/assign`, payload)
      .then((res) => res.data);
  },

  assignments(businessId: number, query?: RoleAssignmentQuery) {
    return api
      .get<PaginatedResponse<RoleAssignment>>(
        `${basePath(businessId)}/assignments${buildQueryString(query)}`,
      )
      .then((res) => res.data);
  },

  updateAssignment(
    businessId: number,
    assignmentId: number,
    payload: UpdateRoleAssignmentPayload,
  ) {
    return api
      .patch<RoleAssignment>(
        `${basePath(businessId)}/assignments/${assignmentId}`,
        payload,
      )
      .then((res) => res.data);
  },

  revokeAssignment(businessId: number, assignmentId: number) {
    return api
      .delete<MessageResponse>(
        `${basePath(businessId)}/assignments/${assignmentId}`,
      )
      .then((res) => res.data);
  },
};
