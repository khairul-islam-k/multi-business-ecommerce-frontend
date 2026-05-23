import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import { AttributePayload, AttributeUpdatePayload, AttributeValuePayload, ResponseAttributeValue, ResponseProductAttribute } from "@/types/product/attribute";

const basePath = (businessId: ApiId, productId: ApiId) => `/product-catalog/businesses/${businessId}/products/${productId}/attributes`;
export const productAttributeApi = {
//   list(businessId: ApiId, query?: CategoriesQuery) {
//     return api
//       .get<ApiPaginatedResponse<ResponseBrand>>(
//         `${basePath(businessId)}${buildQueryString(query)}`,
//       )
//       .then((res) => normalizePaginatedResponse(res.data));
//   },

  get(businessId: ApiId, product: ApiId) {
    return api
      .get<ApiResponse<ResponseProductAttribute[]>>(`${basePath(businessId, product)}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, productId: ApiId, payload: AttributePayload) {
    return api
      .post<ApiResponse<ResponseProductAttribute>>(basePath(businessId, productId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  createValue(businessId: ApiId, productId: ApiId, attributeId: ApiId, payload: AttributeValuePayload) {
    return api
      .post<ApiResponse<ResponseAttributeValue>>(`${basePath(businessId, productId)}/${attributeId}/values`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },
  update(
    businessId: ApiId,
    ProductId: ApiId,
    attributeId: ApiId,
    payload: AttributeUpdatePayload,
  ) {
    return api
      .patch<ApiResponse<ResponseProductAttribute>>(
        `${basePath(businessId, ProductId)}/${attributeId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },
  updateValue(
    businessId: ApiId,
    productId: ApiId,
    attributeId: ApiId,
    valueId: ApiId,
    payload: AttributeValuePayload,
  ) {
    return api
      .patch<ApiResponse<ResponseAttributeValue>>(
        `${basePath(businessId, productId)}/${attributeId}/values/${valueId}`, payload
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  removeName(businessId: ApiId, productId: ApiId, attributeId: ApiId,) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId, productId)}/${attributeId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },
  removeValue(businessId: ApiId, productId: ApiId, attributeId: ApiId, valueId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId, productId)}/${attributeId}/values/${valueId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};