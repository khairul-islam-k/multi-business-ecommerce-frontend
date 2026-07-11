import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { AttributePayload, AttributeUpdatePayload, AttributeValuePayload, ResponseAttributeValue, ResponseProductAttribute } from "@/types/product/attribute";

const basePath = (businessId: ApiId) => `/product-catalog/businesses/${businessId}/attributes`;
export const productAttributeApi = {
  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<ResponseProductAttribute>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, attributeId: ApiId) {
    return api
      .get<ApiResponse<ResponseProductAttribute>>(`${basePath(businessId)}/${attributeId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: AttributePayload) {
    return api
      .post<ApiResponse<ResponseProductAttribute>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  createValue(businessId: ApiId, attributeId: ApiId, payload: AttributeValuePayload) {
    return api
      .post<ApiResponse<ResponseAttributeValue>>(`${basePath(businessId)}/${attributeId}/values`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    attributeId: ApiId,
    payload: AttributeUpdatePayload,
  ) {
    return api
      .patch<ApiResponse<ResponseProductAttribute>>(
        `${basePath(businessId)}/${attributeId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
  updateValue(
    businessId: ApiId,
    attributeId: ApiId,
    valueId: ApiId,
    payload: AttributeValuePayload,
  ) {
    return api
      .patch<ApiResponse<ResponseAttributeValue>>(
        `${basePath(businessId)}/${attributeId}/values/${valueId}`, payload
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  removeName(businessId: ApiId, attributeId: ApiId,) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${attributeId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },
  removeValue(businessId: ApiId, attributeId: ApiId, valueId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${attributeId}/values/${valueId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};