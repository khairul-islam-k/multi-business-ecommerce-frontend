import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { PurchaseOrderPayload, PurchaseOrderResponse } from "@/types/suppliers/purchase-order";

const basePath = (businessId: ApiId) => `/suppliers/businesses/${businessId}/purchase-orders`;
export const purchaseOrderApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<PurchaseOrderResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, purchaseOrderId: ApiId) {
    return api
      .get<ApiResponse<PurchaseOrderResponse>>(`${basePath(businessId)}/${purchaseOrderId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: PurchaseOrderPayload) {
    return api
      .post<ApiResponse<PurchaseOrderResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
//   update(
//     businessId: ApiId,
//     brandId: ApiId,
//     payload: BrandPayload,
//   ) {
//     return api
//       .patch<ApiResponse<ResponseBrand>>(
//         `${basePath(businessId)}/${brandId}`,
//         payload,
//       )
//       .then((res) => unwrapApiResponse(res.data));
//   },

  remove(businessId: ApiId, purchaseId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${purchaseId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};