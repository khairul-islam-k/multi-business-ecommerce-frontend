import api from "@/lib/axios";
import { buildQueryString } from "@/lib/api/params";
import type {
  MessageResponse,
  PaginatedResponse,
  Permission,
  PermissionItem,
  PermissionPayload,
  PermissionQuery,
} from "@/lib/api/types";

const businessPath = (businessId: number) =>
  `/permissions/businesses/${businessId}`;

const rolePath = (businessId: number, roleId: number) =>
  `${businessPath(businessId)}/roles/${roleId}`;

type AvailablePermissionsResponse =
  | PermissionItem[]
  | {
      actions?: string[];
      features?: Array<{
        feature: string;
        actions?: string[];
      }>;
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
      .get<AvailablePermissionsResponse>("/permissions/available")
      .then((res) => normalizeAvailablePermissions(res.data));
  },

  has(businessId: number, payload: PermissionItem) {
    return api
      .post<boolean>(`permissions/has/businesses/${businessId}`, payload)
      .then((res) => res.data);
  },

  list(businessId: number, query?: PermissionQuery) {
    return api
      .get<
        PaginatedResponse<Permission>
      >(`${businessPath(businessId)}${buildQueryString(query)}`)
      .then((res) => res.data);
  },

  byRole(businessId: number, roleId: number) {
    return api
      .get<PermissionItem[]>(rolePath(businessId, roleId))
      .then((res) => res.data);
  },

  addToRole(businessId: number, roleId: number, payload: PermissionPayload) {
    return api
      .post<PermissionItem[]>(rolePath(businessId, roleId), payload)
      .then((res) => res.data);
  },

  replaceRolePermissions(
    businessId: number,
    roleId: number,
    payload: PermissionPayload,
  ) {
    return api
      .put<PermissionItem[]>(rolePath(businessId, roleId), payload)
      .then((res) => res.data);
  },

  removeFromRole(
    businessId: number,
    roleId: number,
    feature: string,
    action: string,
  ) {
    return api
      .delete<MessageResponse>(
        `${rolePath(businessId, roleId)}/${feature}/${action}`,
      )
      .then((res) => res.data);
  },
};
