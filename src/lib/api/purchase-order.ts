import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { Note, PurchaseOrderPayload, PurchaseOrderResponse, PurchaseReturnPayload, UpdatePurchaseOrderPayload } from "@/types/suppliers/purchase-order";

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

  purchaseOrderRequest(businessId: ApiId, purchaseId: ApiId, payload: PurchaseReturnPayload) {
    return api
      .post<ApiResponse<unknown>>(`${basePath(businessId)}/${purchaseId}/returns`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(
    businessId: ApiId,
    purchaseId: ApiId,
    payload: UpdatePurchaseOrderPayload,
  ) {
    return api
      .patch<ApiResponse<PurchaseOrderResponse>>(
        `${basePath(businessId)}/${purchaseId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  receivePO(businessId: ApiId, purchaseId: ApiId, payload: Note) {
    return api
      .patch<ApiResponse<PurchaseOrderResponse>>(
        `${basePath(businessId)}/${purchaseId}/receive`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  cancelPO(businessId: ApiId, purchaseId: ApiId, payload: Note) {
    return api
      .patch<ApiResponse<PurchaseOrderResponse>>(
        `${basePath(businessId)}/${purchaseId}/cancel`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, purchaseId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${purchaseId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};