import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";

import { templateOrderHistoryApi } from "../template-order-history";
import { ReturnRequestPayload, TemplateOrderQuery } from "@/types/template/order-history";
import { ProductWishListPayload } from "@/types/template/wishList";
import { templateProductWishListApi } from "../template-product-wishList";

export function useTemplateProductWishListQuery(query?: TemplateOrderQuery) {
    return useQuery({
        queryKey: apiQueryKeys.templateProductWishList.list(query),
        queryFn: () => templateProductWishListApi.list(query),
    });
}

// export function useTemplateOrder(orderId: ApiId) {
//     return useQuery({
//         queryKey: apiQueryKeys.templateOrderHistory.detail(orderId),

//         queryFn: () => {
//             if (!orderId) {
//                 throw new Error("Business ID and Category ID are required");
//             }

//             return templateOrderHistoryApi.get(orderId);
//         },

//         enabled: Boolean(orderId),
//     });
// }

export function useTemplateProductWishListMutation() {
    const queryClient = useQueryClient();

    const invalidate = () =>
        queryClient.invalidateQueries({
            queryKey: apiQueryKeys.templateProductWishList.all(),
        });

    return {
        addWishList: useMutation({
            mutationFn: (payload: ProductWishListPayload) =>
                templateProductWishListApi.addWishList(payload),
            onSuccess: invalidate,
        }),

        removeWishList: useMutation({
            mutationFn: (brandId: ApiId) =>
                templateProductWishListApi.remove(brandId),
            onSuccess: invalidate,
        }),
    };
}