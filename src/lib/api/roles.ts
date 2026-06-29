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
  AssignRolePayload,
  Role,
  RoleAssignment,
  RoleAssignmentQuery,
  RolePayload,
  RoleQuery,
  UpdateRoleAssignmentPayload,
} from "@/lib/api/types";

const basePath = (businessId: ApiId) => `/roles/businesses/${businessId}`;

const sanitizeRolePayload = (payload: RolePayload | Partial<RolePayload>) => ({
  ...payload,
  permissions: payload.permissions?.map((permission) => ({
    feature: permission.feature,
    action: permission.action,
  })),
});

export const rolesApi = {
  list(businessId: ApiId, query?: RoleQuery) {
    return api
      .get<ApiPaginatedResponse<Role>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  create(businessId: ApiId, payload: RolePayload) {
    return api
      .post<ApiResponse<Role>>(basePath(businessId), sanitizeRolePayload(payload))
      .then((res) => unwrapApiResponse(res.data));
  },

  get(businessId: ApiId, roleId: ApiId) {
    return api
      .get<ApiResponse<Role>>(`${basePath(businessId)}/${roleId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(businessId: ApiId, roleId: ApiId, payload: Partial<RolePayload>) {
    return api
      .patch<ApiResponse<Role>>(
        `${basePath(businessId)}/${roleId}`,
        sanitizeRolePayload(payload),
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, roleId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${roleId}`)
      .then((res) => ({
        message: res.data.message ?? "Role deleted successfully",
      }));
  },

  assign(businessId: ApiId, roleId: ApiId, payload: AssignRolePayload) {
    return api
      .post<ApiResponse<RoleAssignment>>(
        `${basePath(businessId)}/${roleId}/assign`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  assignments(businessId: ApiId, query?: RoleAssignmentQuery) {
    return api
      .get<ApiPaginatedResponse<RoleAssignment>>(
        `${basePath(businessId)}/assignments${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  updateAssignment(
    businessId: ApiId,
    assignmentId: ApiId,
    payload: UpdateRoleAssignmentPayload,
  ) {
    return api
      .patch<ApiResponse<RoleAssignment>>(
        `${basePath(businessId)}/assignments/${assignmentId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  revokeAssignment(businessId: ApiId, assignmentId: ApiId) {
    return api
      .delete<ApiResponse<RoleAssignment>>(
        `${basePath(businessId)}/assignments/${assignmentId}`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
};
