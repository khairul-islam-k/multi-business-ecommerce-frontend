import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { StockTransferPayload, StockTransferResponse } from "@/types/stock/stock-tansfer";
import { AdjustmentQuery } from "@/types/stock/adjustment";

const basePath = (businessId: ApiId) => `inventory/businesses/${businessId}/stock-transfers`;
export const stockTransferApi = {
  list(businessId: ApiId, query?: AdjustmentQuery) {
    return api
      .get<ApiPaginatedResponse<StockTransferResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, transferId: ApiId) {
    return api
      .get<ApiResponse<StockTransferResponse>>(`${basePath(businessId)}/${transferId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: StockTransferPayload) {
    return api
      .post<ApiResponse<StockTransferResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  updateShip(
    businessId: ApiId,
    transferId: ApiId,
  ) {
    return api
      .patch<ApiResponse<StockTransferResponse>>(
        `${basePath(businessId)}/${transferId}/ship`)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateReceive(
    businessId: ApiId,
    transferId: ApiId,
  ) {
    return api
      .patch<ApiResponse<StockTransferResponse>>(
        `${basePath(businessId)}/${transferId}/receive`)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateCancel(
    businessId: ApiId,
    transferId: ApiId,
  ) {
    return api
      .patch<ApiResponse<StockTransferResponse>>(
        `${basePath(businessId)}/${transferId}/cancel`)
      .then((res) => unwrapApiResponse(res.data));
  },

};