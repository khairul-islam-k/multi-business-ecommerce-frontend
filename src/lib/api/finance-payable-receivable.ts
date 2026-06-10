import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { PayableQuery, PayableResponse, ReceivableQuery, ReceivableResponse } from "@/types/finance/payable";

const basePath = (businessId: ApiId) => `/finance/businesses/${businessId}/payables`;
const basePathReceivable = (businessId: ApiId) => `/finance/businesses/${businessId}/receivables`;

export const financePayableReceivableApi = {
  list(businessId: ApiId, query?: PayableQuery) {
    return api
      .get<ApiPaginatedResponse<PayableResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  listReceivable(businessId: ApiId, query?: ReceivableQuery) {
    return api
      .get<ApiPaginatedResponse<ReceivableResponse>>(
        `${basePathReceivable(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  getPayable(businessId: ApiId, payableId: ApiId) {
    return api
      .get<ApiResponse<PayableResponse>>(`${basePath(businessId)}/${payableId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  getReceivable(businessId: ApiId, payableId: ApiId) {
    return api
      .get<ApiResponse<ReceivableResponse>>(`${basePathReceivable(businessId)}/${payableId}`)
      .then((res) => unwrapApiResponse(res.data));
  },


//   update(
//     businessId: ApiId,
//     accountId: ApiId,
//     payload: FinanceAccountPayload,
//   ) {
//     return api
//       .patch<ApiResponse<FinanceAccountResponse>>(
//         `${basePath(businessId)}/${accountId}`,
//         payload,
//       )
//       .then((res) => unwrapApiResponse(res.data));
//   },

};