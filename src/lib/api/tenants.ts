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
  Tenant,
  TenantDetail,
  TenantQuery,
  UpdateTenantStatusPayload,
} from "@/lib/api/types";

export const tenantsApi = {
  list(query?: TenantQuery) {
    return api
      .get<ApiPaginatedResponse<Tenant>>(`/tenants${buildQueryString(query)}`)
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(tenantId: ApiId) {
    return api
      .get<ApiResponse<TenantDetail>>(`/tenants/${tenantId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateStatus(tenantId: ApiId, payload: UpdateTenantStatusPayload) {
    return api
      .patch<ApiResponse<Tenant>>(`/tenants/${tenantId}/status`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
};
