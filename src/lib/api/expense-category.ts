import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { ExpenseCategoryPayload, ExpenseCategoryResponse } from "@/types/stock/expense-category";

const basePath = (businessId: ApiId) => `/finance/businesses/${businessId}/expense-categories`;
export const ExpenseCategoryApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<ExpenseCategoryResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  create(businessId: ApiId, payload: ExpenseCategoryPayload) {
    return api
      .post<ApiResponse<ExpenseCategoryResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(
    businessId: ApiId,
    expenseId: ApiId,
    payload: ExpenseCategoryPayload,
  ) {
    return api
      .patch<ApiResponse<ExpenseCategoryResponse>>(
        `${basePath(businessId)}/${expenseId}`,
        payload,
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