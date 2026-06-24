import { ProductCategoryPayload, ResponseCategory } from "@/types/product/product";
import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/categories`;

type CategoryTreeNode = {
  category: ResponseCategory;
  children?: CategoryTreeNode[];
};

const isCategoryTreeNode = (value: unknown): value is CategoryTreeNode =>
  Boolean(
    value &&
      typeof value === "object" &&
      "category" in value &&
      (value as CategoryTreeNode).category,
  );

const normalizeCategory = (
  value: ResponseCategory | CategoryTreeNode,
): ResponseCategory => {
  if (!isCategoryTreeNode(value)) return value;

  return {
    ...value.category,
    children: value.children?.map(normalizeCategory) ?? value.category.children ?? [],
  };
};

export const productCategoriesApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<ResponseCategory | CategoryTreeNode>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => {
        const response = normalizePaginatedResponse(res.data);

        return {
          ...response,
          items: response.items.map(normalizeCategory),
        };
      });
  },

  get(businessId: ApiId, CategoryId: ApiId) {
    return api
      .get<ApiResponse<ResponseCategory | CategoryTreeNode>>(`${basePath(businessId)}/${CategoryId}`)
      .then((res) => normalizeCategory(unwrapApiResponse(res.data)));
  },

  create(businessId: ApiId, payload: ProductCategoryPayload) {
    return api
      .post<ApiResponse<ResponseCategory>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    CategoryId: ApiId,
    payload: ProductCategoryPayload,
  ) {
    return api
      .patch<ApiResponse<ResponseCategory>>(
        `${basePath(businessId)}/${CategoryId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, CategoryId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${CategoryId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};
