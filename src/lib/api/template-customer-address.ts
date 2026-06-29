import {  unwrapApiResponse, unwrapArrayResponse } from "./response";
import { ApiArrayResponse, ApiId, ApiResponse } from "./types";

import { CustomerAddressPayload } from "@/types/template/customer-address";
import webApi from "../public-api-hook/web-api";
import { CustomerAddress } from "@/types/template/address";

const basePath = () => `/storefront/customer/addresses`;
export const templateCustomerAddressApi = {
  list() {
    return webApi
      .get<ApiArrayResponse<CustomerAddress>>(
        `${basePath()}`,
      )
      .then((res) => unwrapArrayResponse(res.data));
  },

  get(addressId: ApiId) {
    return webApi
      .get<ApiResponse<CustomerAddress>>(`${basePath()}/${addressId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(payload: CustomerAddressPayload) {
    return webApi
      .post<ApiResponse<CustomerAddress>>(basePath(), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    addressId: ApiId,
    payload: CustomerAddressPayload,
  ) {
    return webApi
      .patch<ApiResponse<CustomerAddress>>(
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