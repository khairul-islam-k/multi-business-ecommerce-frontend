import type { SupplierInvoice } from "@/types/suppliers/return";

import api from "../axios";
import { buildQueryString } from "./params";
import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  ListQuery,
} from "./types";

export type SupplierInvoiceStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED";

export type SupplierInvoiceQuery = ListQuery & {
  supplierId?: ApiId;
  status?: SupplierInvoiceStatus;
};

const basePath = (businessId: ApiId) =>
  `/suppliers/businesses/${businessId}/supplier-invoices`;

export const supplierInvoicesApi = {
  list(businessId: ApiId, query?: SupplierInvoiceQuery) {
    return api
      .get<ApiPaginatedResponse<SupplierInvoice>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, supplierInvoiceId: ApiId) {
    return api
      .get<ApiResponse<SupplierInvoice>>(
        `${basePath(businessId)}/${supplierInvoiceId}`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
};
