import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse} from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { CancelOrderPayload, CustomerOrderResponse, ReturnRequestPayload, TemplateOrderQuery } from "@/types/template/order-history";

const basePath = () => `/storefront/customer/orders`;

export const templateOrderHistoryApi = {
  list(query?: TemplateOrderQuery) {
    return webApi
      .get<ApiPaginatedResponse<CustomerOrderResponse>>(
        `${basePath()}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(orderId: ApiId) {
    return webApi
      .get<ApiResponse<CustomerOrderResponse>>(`${basePath()}/${orderId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  cancelOrder(orderId: ApiId, payload: CancelOrderPayload) {
    return webApi
      .post<ApiResponse<CustomerOrderResponse>>(`${basePath()}/${orderId}/cancel`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  orderReturnRequest(orderId: ApiId, payload: ReturnRequestPayload) {
    return webApi
      .post<ApiResponse<CustomerOrderResponse>>(`${basePath()}/${orderId}/return`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

};