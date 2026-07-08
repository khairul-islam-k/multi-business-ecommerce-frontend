import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { InvoiceTenantResponse } from "@/types/invoice/invoice";
import { invoiceQuery } from "@/types/template/invoice";

const basePath = (businessId: ApiId) => `/orders/businesses/${businessId}/invoices`;
export const tenantInvoiceApi = {
  list(businessId: ApiId, query?: invoiceQuery) {
    return api
      .get<ApiPaginatedResponse<InvoiceTenantResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, invoiceId: ApiId) {
    return api
      .get<ApiResponse<InvoiceTenantResponse>>(`${basePath(businessId)}/${invoiceId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

};