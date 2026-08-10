import { unwrapApiResponse, unwrapArrayResponse } from "./response";
import { ApiArrayResponse, ApiId, ApiResponse } from "./types";
import { CourierAreaResponse, CourierChargeCalculationResponse, CourierConfigResponse, CourierDeliveryPayload, CourierProvider, PathaoZoneListResponse } from "@/types/courier/courier";
import webApi from "../public-api-hook/web-api";

const basePath = () => `/storefront/couriers`;
export const templateCourierApi = {
  listCourier() {
    return webApi
      .get<ApiArrayResponse<CourierConfigResponse>>(
        basePath()
      )
      .then((res) => unwrapArrayResponse(res.data));
  },

  getCities(configId: ApiId) {
    return webApi
      .get<ApiResponse<CourierAreaResponse>>(`${basePath()}/${configId}/courier/cities`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getZoneInsideCity(configId: ApiId, cityId: ApiId) {
    return webApi
      .get<ApiResponse<PathaoZoneListResponse>>(`${basePath()}/${configId}/cities/${cityId}`)
      .then((res) => unwrapApiResponse(res.data));
  },


  shippingCharge(configId: ApiId, payload: CourierDeliveryPayload) {
    return webApi
      .post<ApiResponse<CourierChargeCalculationResponse>>(`${basePath()}/${configId}/shipping-charge`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

};