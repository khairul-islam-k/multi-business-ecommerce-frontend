import { unwrapApiResponse } from "./response";
import { ApiId, ApiResponse } from "./types";
import api from "../axios";
import { ResponseVariant, VariantPayload } from "@/types/product/variant";

const basePath = (businessId: ApiId, productId: ApiId) => `/product-catalog/businesses/${businessId}/products/${productId}/variants`;
export const productVariantApi = {
    
    list(businessId: ApiId, productId: ApiId, search: string) {
        return api
            .get<ApiResponse<ResponseVariant[]>>(
                `${basePath(businessId, productId)}?search=${search}`,
            )
            .then((res) => unwrapApiResponse(res.data));
    },

    get(businessId: ApiId, productId: ApiId, variantId: ApiId) {
        return api
            .get<ApiResponse<ResponseVariant>>(`${basePath(businessId, productId)}/${variantId}`)
            .then((res) => unwrapApiResponse(res.data));
    },

    create(businessId: ApiId, productId: ApiId, payload: VariantPayload) {
        return api
            .post<ApiResponse<ResponseVariant>>(basePath(businessId, productId), payload)
            .then((res) => unwrapApiResponse(res.data));
    },

    update(
        businessId: ApiId,
        productId: ApiId,
        variantId: ApiId,
        payload: VariantPayload,
    ) {
        return api
            .patch<ApiResponse<ResponseVariant>>(
                `${basePath(businessId, productId)}/${variantId}`,
                payload,
            )
            .then((res) => unwrapApiResponse(res.data));
    },

    remove(businessId: ApiId, productId: ApiId, variantId: ApiId) {
        return api
            .delete<ApiResponse<null>>(`${basePath(businessId, productId)}/${variantId}`)
            .then((res) => ({
                message: res.data.message ?? "Employee deleted successfully",
            }));
    },

};