import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { CourierAreaResponse, CourierConfigResponse, CourierProvider, PickupStore, PickupStorePayload, PickupStoresResponse, UpdateCourierConfigPayload } from "@/types/courier/courier";

const basePath = (businessId: ApiId) => `/couriers/businesses/${businessId}/configs`;
export const courierApi = {
  listProvider(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<CourierProvider>>(
        `/couriers/businesses/${businessId}/couriers${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<CourierConfigResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  getAreas(businessId: ApiId, configId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiResponse<CourierAreaResponse>>(`${basePath(businessId)}/${configId}/redx/areas${buildQueryString(query)}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getPickUp(businessId: ApiId, configId: ApiId) {
    return api
      .get<ApiResponse<PickupStoresResponse>>(`${basePath(businessId)}/${configId}/redx/pickup-stores`)
      .then((res) => unwrapApiResponse(res.data));
  },

  createPickUp(businessId: ApiId, configId: ApiId, payload: PickupStorePayload) {
    return api
      .post<ApiResponse<PickupStore>>(`${basePath(businessId)}/${configId}/redx/pickup-stores`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  updatePickUp(businessId: ApiId, configId: ApiId, storeId: ApiId,  payload: PickupStorePayload) {
    return api
      .patch<ApiResponse<PickupStore>>(`${basePath(businessId)}/${configId}/redx/pickup-stores/${storeId}`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  updateBulk(
    businessId: ApiId,
    payload: UpdateCourierConfigPayload,
  ) {
    return api
      .patch<ApiResponse<CourierConfigResponse>>(
        `${basePath(businessId)}/bulk`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

    removePickUpStore(businessId: ApiId, configId: ApiId, storeId: ApiId) {
      return api
        .delete<ApiResponse<null>>(`${basePath(businessId)}/${configId}/redx/pickup-stores/${storeId}`)
        .then((res) => ({
          message: res.data.message ?? "Employee deleted successfully",
        }));
    },

};