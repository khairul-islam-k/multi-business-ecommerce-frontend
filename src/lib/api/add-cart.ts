import { normalizePaginatedResponse, unwrapApiResponse, unwrapArrayResponse } from "./response";
import { ApiArrayResponse, ApiId, ApiPaginatedResponse, ApiResponse} from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { AddToCartPayload, CartQuery, CustomerCartResponse, UpdateQuantity } from "@/types/template/add-cart";

const basePath = () => `/storefront/customer/cart/items`;
export const addCartApi = {
    listCart(query?: CartQuery) {
        return webApi
            .get<ApiPaginatedResponse<CustomerCartResponse>>(
                `/storefront/customer/carts${buildQueryString(query)}`,
            )
            .then((res) => normalizePaginatedResponse(res.data));
    },

    getOldCart(cartId: ApiId) {
        return webApi
            .get<ApiArrayResponse<CustomerCartResponse>>(`/storefront/customer/carts/${cartId}`)
            .then((res) => unwrapApiResponse(res.data));
    },

    get() {
        return webApi
            .get<ApiArrayResponse<CustomerCartResponse>>(`/storefront/customer/carts`)
            .then((res) => unwrapArrayResponse(res.data));
    },

    getActiveCart() {
        return webApi
            .get<ApiResponse<CustomerCartResponse>>(`/storefront/customer/cart`)
            .then((res) => unwrapApiResponse(res.data));;
    },

    create(payload: AddToCartPayload) {
        return webApi
            .post<ApiResponse<CustomerCartResponse>>(basePath(), payload)
            .then((res) => unwrapApiResponse(res.data));
    },

    updateQuantity(
        itemId: ApiId,
        payload: UpdateQuantity,
    ) {
        return webApi
            .patch<ApiResponse<unknown>>(
                `${basePath()}/${itemId}`,
                payload,
            )
            .then((res) => unwrapApiResponse(res.data));
    },

    removeActiveCartItem(itemId: ApiId) {
        return webApi
            .delete<ApiResponse<null>>(`${basePath()}/${itemId}`)
            .then((res) => ({
                message: res.data.message ?? "Employee deleted successfully",
            }));
    },

};