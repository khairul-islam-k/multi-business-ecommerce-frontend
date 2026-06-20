import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { CustomerPayload, CustomerResponse } from "@/types/customer/customer";
import type { OrderQuery, OrderResponse } from "./orders";

const basePath = (businessId: ApiId) => `/customers/businesses/${businessId}/customers`;
export const customerApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<CustomerResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

    get(businessId: ApiId, customerId: ApiId) {
      return api
        .get<ApiResponse<CustomerResponse>>(`${basePath(businessId)}/${customerId}`)
      .then((res) => unwrapApiResponse(res.data));
    },

  orders(businessId: ApiId, customerId: ApiId, query?: OrderQuery) {
    return api
      .get<ApiPaginatedResponse<OrderResponse>>(
        `${basePath(businessId)}/${customerId}/orders${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  create(businessId: ApiId, payload: CustomerPayload) {
    return api
      .post<ApiResponse<CustomerResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
    update(
      businessId: ApiId,
      customerId: ApiId,
      payload: CustomerPayload,
    ) {
      return api
        .patch<ApiResponse<CustomerResponse>>(
          `${basePath(businessId)}/${customerId}`,
          payload,
        )
        .then((res) => unwrapApiResponse(res.data));
    },

    remove(businessId: ApiId, customerId: ApiId) {
      return api
        .delete<ApiResponse<null>>(`${basePath(businessId)}/${customerId}`)
        .then((res) => ({
          message: res.data.message ?? "Employee deleted successfully",
        }));
    },

};
