import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { AddMoneyPayload, FinanceAccountPayload, FinanceAccountResponse, FinanceTransactionResponse } from "@/types/finance/account";
import { ProductQuery } from "@/types/product/product";

const basePath = (businessId: ApiId) => `/finance/businesses/${businessId}/accounts`;
export const financeAccountApi = {
  list(businessId: ApiId, query?: ProductQuery) {
    return api
      .get<ApiPaginatedResponse<FinanceAccountResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  listTransaction(businessId: ApiId, accountId: ApiId, query?: ProductQuery) {
    return api
      .get<ApiPaginatedResponse<FinanceTransactionResponse>>(
        `${basePath(businessId)}/${accountId}/transactions${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, accountId: ApiId) {
    return api
      .get<ApiResponse<FinanceAccountResponse>>(`${basePath(businessId)}/${accountId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: FinanceAccountPayload) {
    return api
      .post<ApiResponse<FinanceAccountResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  addMoney(businessId: ApiId, accountId: ApiId, payload: AddMoneyPayload) {
    return api
      .post<ApiResponse<FinanceAccountResponse>>(`${basePath(businessId)}/${accountId}/add-money`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(
    businessId: ApiId,
    accountId: ApiId,
    payload: FinanceAccountPayload,
  ) {
    return api
      .patch<ApiResponse<FinanceAccountResponse>>(
        `${basePath(businessId)}/${accountId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, accountId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${accountId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};