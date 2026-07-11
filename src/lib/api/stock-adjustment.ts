import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { AdjustmentQuery, StockAdjustmentPayload, StockAdjustmentResponse } from "@/types/stock/adjustment";

const basePath = (businessId: ApiId) => `/inventory/businesses/${businessId}/stock-adjustments`;
export const stockAdjustmentApi = {
  list(businessId: ApiId, query?: AdjustmentQuery) {
    return api
      .get<ApiPaginatedResponse<StockAdjustmentResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, adjustmentId: ApiId) {
    return api
      .get<ApiResponse<StockAdjustmentResponse>>(`${basePath(businessId)}/${adjustmentId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: StockAdjustmentPayload) {
    return api
      .post<ApiResponse<StockAdjustmentResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  updateApprove(
    businessId: ApiId,
    adjustmentId: ApiId,
  ) {
    return api
      .patch<ApiResponse<StockAdjustmentResponse>>(
        `${basePath(businessId)}/${adjustmentId}/approve`)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateCancel(
    businessId: ApiId,
    adjustmentId: ApiId,
  ) {
    return api
      .patch<ApiResponse<StockAdjustmentResponse>>(
        `${basePath(businessId)}/${adjustmentId}/cancel`)
      .then((res) => unwrapApiResponse(res.data));
  },

};