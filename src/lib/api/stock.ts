import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { InventoryStockResponse, LowStockAlertFormValues } from "@/types/stock/stock";
import { StockMovementResponse } from "@/types/stock/movement";

const basePath = (businessId: ApiId) => `/inventory/businesses/${businessId}/stocks`;
export const productStockApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<InventoryStockResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  movementList(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<StockMovementResponse>>(
        `${basePath(businessId)}/movements${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

    get(businessId: ApiId, stockId: ApiId) {
      return api
        .get<ApiResponse<InventoryStockResponse>>(`${basePath(businessId)}/${stockId}`)
        .then((res) => unwrapApiResponse(res.data));
    },

    updateLowAlert(
      businessId: ApiId,
      stockId: ApiId,
      payload: LowStockAlertFormValues,
    ) {
      return api
        .patch<ApiResponse<unknown>>(
          `${basePath(businessId)}/${stockId}/alert`,
          payload,
        )
        .then((res) => unwrapApiResponse(res.data));
    },

  };
