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
  Permission,
  PermissionAction,
  PermissionItem,
  PermissionPayload,
  PermissionQuery,
  RbacFeature,
  Role,
} from "@/lib/api/types";

const businessPath = (businessId: ApiId) =>
  `/permissions/businesses/${businessId}`;

const rolePath = (businessId: ApiId, roleId: ApiId) =>
  `${businessPath(businessId)}/roles/${roleId}`;

type AvailablePermissionsResponse =
  | PermissionItem[]
  | {
      actions?: PermissionAction[];
      features?: Array<{
        feature: RbacFeature;
        actions?: PermissionAction[];
      }>;
    };

type HasPermissionResponse = {
  hasPermission: boolean;
};

const normalizeAvailablePermissions = (
  payload: AvailablePermissionsResponse,
): PermissionItem[] => {
  if (Array.isArray(payload)) return payload;

  return (payload.features ?? []).flatMap((feature) =>
    (feature.actions ?? payload.actions ?? []).map((action) => ({
      feature: feature.feature,
      action,
    })),
  );
};

export const permissionsApi = {
  available() {
    return api
      .get<ApiResponse<AvailablePermissionsResponse>>("/permissions/available")
      .then((res) =>
        normalizeAvailablePermissions(unwrapApiResponse(res.data)),
      );
  },

  has(businessId: ApiId, payload: PermissionItem) {
    return api
      .post<
        ApiResponse<HasPermissionResponse>
      >(`permissions/has/businesses/${businessId}`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  list(businessId: ApiId, query?: PermissionQuery) {
    return api
      .get<
        ApiPaginatedResponse<Permission>
      >(`${businessPath(businessId)}${buildQueryString(query)}`)
      .then((res) => normalizePaginatedResponse(res.data));
  },

  byRole(businessId: ApiId, roleId: ApiId) {
    return api
      .get<ApiResponse<Role>>(rolePath(businessId, roleId))
      .then((res) => unwrapApiResponse(res.data).permissions ?? []);
  },

  addToRole(businessId: ApiId, roleId: ApiId, payload: PermissionPayload) {
    return api
      .post<
        ApiResponse<{ permissions?: PermissionItem[] }>
      >(rolePath(businessId, roleId), payload)
      .then((res) => unwrapApiResponse(res.data).permissions ?? []);
  },

  replaceRolePermissions(
    businessId: ApiId,
    roleId: ApiId,
    payload: PermissionPayload,
  ) {
    return api
      .put<
        ApiResponse<{ permissions?: PermissionItem[] }>
      >(rolePath(businessId, roleId), payload)
      .then((res) => unwrapApiResponse(res.data).permissions ?? []);
  },

  removeFromRole(
    businessId: ApiId,
    roleId: ApiId,
    feature: string,
    action: string,
  ) {
    return api
      .delete<
        ApiResponse<{ permissions?: PermissionItem[] }>
      >(`${rolePath(businessId, roleId)}/${feature}/${action}`)
      .then((res) => ({
        message: res.data.message ?? "Permission removed successfully",
      }));
  },
};
