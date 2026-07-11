import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId} from "../types";
import {  TemplateOrderQuery } from "@/types/template/order-history";
import { templateOrderReturnApi } from "../template-return";

export function useTemplateOrderReturnQuery(query?: TemplateOrderQuery) {
    return useQuery({
        queryKey: apiQueryKeys.templateOrderReturn.list(query),
        queryFn: () => templateOrderReturnApi.list(query),
    });
}

export function useTemplateReturnOrder(returnId: ApiId) {
    return useQuery({
        queryKey: apiQueryKeys.templateOrderReturn.detail(returnId),

        queryFn: () => {
            if (!returnId) {
                throw new Error("Business ID and Category ID are required");
            }

            return templateOrderReturnApi.get(returnId);
        },

        enabled: Boolean(returnId),
    });
}

export function useTemplateOrderReturnMutation() {
    const queryClient = useQueryClient();

    const invalidate = () =>
        queryClient.invalidateQueries({
            queryKey: apiQueryKeys.templateOrderReturn.all(),
        });

    return {
        cancelOrder: useMutation({
            mutationFn: (returnId: ApiId) =>
                templateOrderReturnApi.cancelReturn(returnId),
            onSuccess: invalidate,
        }),

        // orderReturn: useMutation({
        //     mutationFn: ({
        //         orderId,
        //         payload,
        //     }: {
        //         orderId: ApiId;
        //         payload: ReturnRequestPayload;
        //     }) => templateOrderHistoryApi.orderReturnRequest(orderId, payload),
        //     onSuccess: invalidate,
        // }),

    };
}