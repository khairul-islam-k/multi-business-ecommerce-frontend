import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse, CategoriesQuery } from "./types";
import api from "../axios";
import { buildQueryString } from "./params";
import {
    SupplierProductPayload,
    SupplierProductQuery,
    SupplierProductResponse,
} from "@/types/suppliers/supplier-product";

const basePath = (businessId: ApiId, supplierId: ApiId) => `/suppliers/businesses/${businessId}/${supplierId}/products`;
const businessProductsPath = (businessId: ApiId) => `/suppliers/businesses/${businessId}/products`;
export const SupplierProductApi = {
    listAll(businessId: ApiId, query?: SupplierProductQuery) {
        return api
            .get<ApiPaginatedResponse<SupplierProductResponse>>(
                `${businessProductsPath(businessId)}${buildQueryString(query)}`,
            )
            .then((res) => normalizePaginatedResponse(res.data));
    },

    list(businessId: ApiId, supplierId: ApiId, query?: CategoriesQuery) {
        return api
            .get<ApiPaginatedResponse<SupplierProductResponse>>(
                `${basePath(businessId, supplierId)}${buildQueryString(query)}`,
            )
            .then((res) => normalizePaginatedResponse(res.data));
    },

    get(businessId: ApiId, supplierId: ApiId, productMId: ApiId) {
        return api
            .get<ApiResponse<SupplierProductResponse>>(`${basePath(businessId, supplierId)}/${productMId}`)
            .then((res) => unwrapApiResponse(res.data));
    },

    create(businessId: ApiId, supplierId: ApiId, payload: SupplierProductPayload) {
        return api
            .post<ApiResponse<SupplierProductResponse>>(basePath(businessId, supplierId), payload)
            .then((res) => unwrapApiResponse(res.data));
    },

    update(
        businessId: ApiId,
        supplierId: ApiId,
        productMId: ApiId,
        payload: SupplierProductPayload,
    ) {
        return api
            .patch<ApiResponse<SupplierProductResponse>>(
                `${basePath(businessId, supplierId)}/${productMId}`,
                payload,
            )
            .then((res) => unwrapApiResponse(res.data));
    },

    remove(businessId: ApiId, supplierId: ApiId, productMId: ApiId) {
        return api
            .delete<ApiResponse<null>>(`${basePath(businessId, supplierId)}/${productMId}`)
            .then((res) => ({
                message: res.data.message ?? "Employee deleted successfully",
            }));
    },

};
