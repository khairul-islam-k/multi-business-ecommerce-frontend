import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import {
  ResponseWebsite,
  WebsiteDomainFormValues,
  WebsiteTemplateOption,
  WebsiteTemplatePayload,
} from "@/types/website/website";

const basePath = (businessId: ApiId) => `/websites/businesses/${businessId}`;
export const websiteApi = {
  templates(businessId: ApiId) {
    return api
      .get<ApiResponse<WebsiteTemplateOption[]>>(
        `${basePath(businessId)}/templates`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  list(businessId: ApiId, query?: CategoriesQuery) {
    return api
      .get<ApiPaginatedResponse<ResponseWebsite>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, websiteId: ApiId) {
    return api
      .get<ApiResponse<ResponseWebsite>>(`${basePath(businessId)}/${websiteId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: WebsiteTemplatePayload) {
    return api
      .post<ApiResponse<ResponseWebsite>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  addDomain(businessId: ApiId, websiteId: ApiId, payload: WebsiteDomainFormValues) {
    return api
      .post<ApiResponse<unknown>>(
        `${basePath(businessId)}/${websiteId}/domains`, payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  update(
    businessId: ApiId,
    websiteId: ApiId,
    payload: WebsiteTemplatePayload,
  ) {
    return api
      .patch<ApiResponse<ResponseWebsite>>(
        `${basePath(businessId)}/${websiteId}`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  updatePublish(
    businessId: ApiId,
    websiteId: ApiId,
  ) {
    return api
      .patch<ApiResponse<ResponseWebsite>>(
        `${basePath(businessId)}/${websiteId}/publish`
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  updateUnPublish(
    businessId: ApiId,
    websiteId: ApiId,
  ) {
    return api
      .patch<ApiResponse<ResponseWebsite>>(
        `${basePath(businessId)}/${websiteId}/unpublish`
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  remove(businessId: ApiId, websiteId: ApiId) {
    return api
      .delete<ApiResponse<null>>(`${basePath(businessId)}/${websiteId}`)
      .then((res) => ({
        message: res.data.message ?? "Employee deleted successfully",
      }));
  },

};
