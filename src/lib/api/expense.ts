import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { ExpensePayload, ExpenseQuery, ExpenseResponse } from "@/types/stock/expense";

const basePath = (businessId: ApiId) => `/finance/businesses/${businessId}/expenses`;
export const ExpenseApi = {
  list(businessId: ApiId, query?: ExpenseQuery) {
    return api
      .get<ApiPaginatedResponse<ExpenseResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, expenseId: ApiId) {
    return api
      .get<ApiResponse<ExpenseResponse>>(`${basePath(businessId)}/${expenseId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: ExpensePayload) {
    return api
      .post<ApiResponse<ExpenseResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

    update(
      businessId: ApiId,
      expenseId: ApiId,
      payload: ExpensePayload,
    ) {
      return api
        .patch<ApiResponse<ExpenseResponse>>(
          `${basePath(businessId)}/${expenseId}`,
          payload,
        )
        .then((res) => unwrapApiResponse(res.data));
    },

    updatePay(
      businessId: ApiId,
      expenseId: ApiId,
    ) {
      return api
        .patch<ApiResponse<ExpenseResponse>>(
          `${basePath(businessId)}/${expenseId}/pay`
        )
        .then((res) => unwrapApiResponse(res.data));
    },

    updateCancel(
      businessId: ApiId,
      expenseId: ApiId,
    ) {
      return api
        .patch<ApiResponse<ExpenseResponse>>(
          `${basePath(businessId)}/${expenseId}/cancel`
        )
        .then((res) => unwrapApiResponse(res.data));
    },

  remove(businessId: ApiId, expenseId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${expenseId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};