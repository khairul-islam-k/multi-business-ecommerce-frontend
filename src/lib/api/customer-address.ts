import { unwrapApiResponse } from "./response";
import { ApiId, ApiResponse } from "./types";
import api from "../axios";
import { CustomerAddressPayload, CustomerAddressResponse } from "@/types/customer/customerAddress";

const basePath = (businessId: ApiId, customerId: ApiId) => `/customers/businesses/${businessId}/customers/${customerId}/addresses`;
export const customerAddressApi = {

  create(businessId: ApiId, customerId: ApiId, payload: CustomerAddressPayload) {
    return api
      .post<ApiResponse<CustomerAddressResponse>>(basePath(businessId, customerId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
    update(
      businessId: ApiId,
      customerId: ApiId,
      addressId: ApiId,
      payload: CustomerAddressPayload,
    ) {
      return api
        .patch<ApiResponse<CustomerAddressResponse>>(
          `${basePath(businessId, customerId)}/${addressId}`,
          payload,
        )
        .then((res) => unwrapApiResponse(res.data));
    },

    remove(businessId: ApiId, customerId: ApiId, addressId: ApiId) {
      return api
        .delete<ApiResponse<null>>(`${basePath(businessId, customerId)}/${addressId}`)
        .then((res) => ({
          message: res.data.message ?? "Employee deleted successfully",
        }));
    },

};