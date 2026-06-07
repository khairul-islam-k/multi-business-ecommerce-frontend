import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { BrandPayload, ResponseBrand } from "@/types/product/brands";
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

    create(businessId: ApiId, payload: BrandPayload) {
      return api
        .post<ApiResponse<ResponseBrand>>(basePath(businessId), payload)
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
    update(
      businessId: ApiId,
      brandId: ApiId,
      payload: BrandPayload,
    ) {
      return api
        .patch<ApiResponse<ResponseBrand>>(
          `${basePath(businessId)}/${brandId}`,
          payload,
        )
        .then((res) => unwrapApiResponse(res.data));
    },

    remove(businessId: ApiId, brandId: ApiId) {
      return api
        .delete<ApiResponse<null>>(`${basePath(businessId)}/${brandId}`)
        .then((res) => ({
          message: res.data.message ?? "Employee deleted successfully",
        }));
    },

  };