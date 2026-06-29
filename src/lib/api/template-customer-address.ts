import {  unwrapApiResponse, unwrapArrayResponse } from "./response";
import { ApiArrayResponse, ApiId, ApiResponse } from "./types";

import { ResponseBrand } from "@/types/product/brands";
import { CustomerAddressPayload } from "@/types/template/customer-address";
import webApi from "../public-api-hook/web-api";

const basePath = () => `/storefront/customer/addresses`;
export const templateCustomerAddressApi = {
  list() {
    return webApi
      .get<ApiArrayResponse<unknown>>(
        `${basePath()}`,
      )
      .then((res) => unwrapArrayResponse(res.data));
  },

  get(addressId: ApiId) {
    return webApi
      .get<ApiResponse<ResponseBrand>>(`${basePath()}/${addressId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(payload: CustomerAddressPayload) {
    return webApi
      .post<ApiResponse<ResponseBrand>>(basePath(), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    addressId: ApiId,
    payload: CustomerAddressPayload,
  ) {
    return webApi
      .patch<ApiResponse<ResponseBrand>>(
        `${basePath()}/${addressId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(addressId: ApiId) {
    return webApi
      .delete<ApiResponse<null>>(`${basePath()}/${addressId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};