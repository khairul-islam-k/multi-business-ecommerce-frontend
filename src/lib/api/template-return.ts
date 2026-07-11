import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse} from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { TemplateOrderQuery } from "@/types/template/order-history";
import { CustomerOrderReturnItemResponse } from "@/types/template/return-history";

const basePath = () => `/storefront/customer/returns`;

export const templateOrderReturnApi = {
  list(query?: TemplateOrderQuery) {
    return webApi
      .get<ApiPaginatedResponse<CustomerOrderReturnItemResponse>>(
        `${basePath()}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(returnId: ApiId) {
    return webApi
      .get<ApiResponse<CustomerOrderReturnItemResponse>>(`${basePath()}/${returnId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  cancelReturn(returnId: ApiId) {
    return webApi
      .post<ApiResponse<unknown>>(`${basePath()}/${returnId}/cancel`)
      .then((res) => unwrapApiResponse(res.data));
  },

};