import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId} from "../types";

import { templateOrderHistoryApi } from "../template-order-history";
import { CancelOrderPayload, ReturnRequestPayload, TemplateOrderQuery } from "@/types/template/order-history";

export function useTemplateOrderHistoryQuery(query?: TemplateOrderQuery) {
    return useQuery({
        queryKey: apiQueryKeys.templateOrderHistory.list(query),
        queryFn: () => templateOrderHistoryApi.list(query),
    });
}

export function useTemplateOrder(orderId: ApiId) {
    return useQuery({
        queryKey: apiQueryKeys.templateOrderHistory.detail(orderId),

        queryFn: () => {
            if (!orderId) {
                throw new Error("Business ID and Category ID are required");
            }

            return templateOrderHistoryApi.get(orderId);
        },

        enabled: Boolean(orderId),
    });
}

export function useTemplateOrderMutation() {
    const queryClient = useQueryClient();

    const invalidate = () =>
        queryClient.invalidateQueries({
            queryKey: apiQueryKeys.templateOrderHistory.all(),
        });

    return {
        cancelOrder: useMutation({
            mutationFn: ({
                orderId,
                payload
            }: {
                orderId : ApiId;
                payload : CancelOrderPayload;
            }) =>
                templateOrderHistoryApi.cancelOrder(orderId, payload),
            onSuccess: invalidate,
        }),

        orderReturn: useMutation({
            mutationFn: ({
                orderId,
                payload,
            }: {
                orderId: ApiId;
                payload: ReturnRequestPayload;
            }) => templateOrderHistoryApi.orderReturnRequest(orderId, payload),
            onSuccess: invalidate,
        }),

    };
}