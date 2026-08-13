import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { AreaCourierResponse, AssignToCourierPayload, AssignWarehousePayload, CourierAreaResponse, CourierConfigResponse, CourierProvider, PathaoZoneListResponse, PickupStorePayload, PickupStoresResponse, ShipmentQuery, ShipmentResponse, ShipmentTrackingResponse, UpdateCourierConfigPayload } from "@/types/courier/courier";

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

  listShipment(businessId: ApiId, query?: ShipmentQuery) {
    return api
      .get<ApiPaginatedResponse<ShipmentResponse>>(
        `/couriers/businesses/${businessId}/shipments${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  shipmentDetails(businessId: ApiId, shippingId: ApiId) {
    return api
      .get<ApiResponse<ShipmentResponse>>(`/couriers/businesses/${businessId}/shipments/${shippingId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  shipmentTracking(businessId: ApiId, shippingId: ApiId) {
    return api
      .get<ApiResponse<ShipmentTrackingResponse>>(`/couriers/businesses/${businessId}/shipments/${shippingId}/track`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getCities(businessId: ApiId, configId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiResponse<CourierAreaResponse>>(`${basePath(businessId)}/${configId}/courier/cities${buildQueryString(query)}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getZonesInsideCity(businessId: ApiId, configId: ApiId, cityId: ApiId) {
    return api
      .get<ApiResponse<PathaoZoneListResponse>>(`${basePath(businessId)}/${configId}/courier/zones/${cityId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getAreasInsideZone(businessId: ApiId, configId: ApiId, zoneId: ApiId) {
    return api
      .get<ApiResponse<AreaCourierResponse>>(`${basePath(businessId)}/${configId}/courier/area/${zoneId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getPickUp(businessId: ApiId, configId: ApiId) {
    return api
      .get<ApiResponse<PickupStoresResponse>>(`${basePath(businessId)}/${configId}/courier/pickup-stores`)
      .then((res) => unwrapApiResponse(res.data));
  },

  AssignWarehouse(businessId: ApiId, storeId: ApiId, payload: AssignWarehousePayload) {
    return api
      .patch<ApiResponse<PickupStoresResponse>>(`/inventory/businesses/${businessId}/warehouses/${storeId}/assign_courier`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  shipmentBook(businessId: ApiId, shipmentId: ApiId) {
    return api
      .post<ApiResponse<unknown>>(`/couriers/businesses/${businessId}/shipments/${shipmentId}/book`)
      .then((res) => unwrapApiResponse(res.data));
  },

  createPickUp(businessId: ApiId, configId: ApiId, payload: PickupStorePayload) {
    return api
      .post<ApiResponse<unknown>>(`${basePath(businessId)}/${configId}/courier/pickup-stores`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  courierAssign(businessId: ApiId, configId: ApiId, payload: AssignToCourierPayload) {
    return api
      .post<ApiResponse<unknown>>(`/couriers/businesses/${businessId}/orders/${configId}/assign
`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  updatePickUp(businessId: ApiId, configId: ApiId, storeId: ApiId,  payload: PickupStorePayload) {
    return api
      .patch<ApiResponse<unknown>>(`${basePath(businessId)}/${configId}/redx/pickup-stores/${storeId}`, payload)
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