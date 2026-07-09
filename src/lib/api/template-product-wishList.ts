import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import { ApiId, ApiPaginatedResponse, ApiResponse } from "./types";
import { buildQueryString } from "./params";
import webApi from "../public-api-hook/web-api";
import { TemplateOrderQuery } from "@/types/template/order-history";
import { ProductWishListPayload, WishlistItem } from "@/types/template/wishList";
import { StorefrontProduct } from "@/types/template/template-product";

const basePath = () => `/storefront/customer/wishlist`;

export const templateProductWishListApi = {
    list(query?: TemplateOrderQuery) {
        return webApi
            .get<ApiPaginatedResponse<WishlistItem>>(
                `${basePath()}${buildQueryString(query)}`,
            )
            .then((res) => normalizePaginatedResponse(res.data));
    },

    addWishList(payload: ProductWishListPayload) {
        return webApi
            .post<ApiResponse<StorefrontProduct>>(`${basePath()}/items`, payload)
            .then((res) => unwrapApiResponse(res.data));
    },

    remove(wishListId: ApiId) {
        return webApi
            .delete<ApiResponse<null>>(`${basePath()}/items/${wishListId}`)
            .then((res) => ({
                message: res.data.message ?? "Employee deleted successfully",
            }));
    },

};