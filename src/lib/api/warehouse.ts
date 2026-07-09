import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { WarehousePayload, WarehouseResponse } from "@/types/product/warehouse";

const basePath = (businessId: ApiId) => `/inventory/businesses/${businessId}/warehouses`;
export const warehouseApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<WarehouseResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, warehouseId: ApiId) {
    return api
      .get<ApiResponse<WarehouseResponse>>(`${basePath(businessId)}/${warehouseId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: WarehousePayload) {
    return api
      .post<ApiResponse<WarehouseResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    warehouseId: ApiId,
    payload: WarehousePayload,
  ) {
    return api
      .patch<ApiResponse<WarehouseResponse>>(
        `${basePath(businessId)}/${warehouseId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, warehouseId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${warehouseId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};