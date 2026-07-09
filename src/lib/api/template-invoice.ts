import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { CustomerInvoiceResponse, invoiceQuery } from "@/types/template/invoice";

const basePath = () => `/storefront/customer/invoices`;
export const templateInvoiceApi = {
  list(query?: invoiceQuery) {
    return webApi
      .get<ApiPaginatedResponse<CustomerInvoiceResponse>>(
        `${basePath()}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(invoiceId: ApiId) {
    return webApi
      .get<ApiResponse<CustomerInvoiceResponse>>(`${basePath()}/${invoiceId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

};