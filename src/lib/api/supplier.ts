import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { SupplierPayload, SupplierResponse } from "@/types/suppliers/supplier";

const basePath = (businessId: ApiId) => `/suppliers/businesses/${businessId}`;
export const SupplierApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<SupplierResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, supplierId: ApiId) {
    return api
      .get<ApiResponse<SupplierResponse>>(`${basePath(businessId)}/${supplierId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: SupplierPayload) {
    return api
      .post<ApiResponse<SupplierResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    supplierId: ApiId,
    payload: SupplierPayload,
  ) {
    return api
      .patch<ApiResponse<SupplierResponse>>(
        `${basePath(businessId)}/${supplierId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, supplierId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${supplierId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};