import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { AdjustmentQuery } from "@/types/stock/adjustment";
import { stockTransferApi } from "../stock-transfer";
import { StockTransferPayload } from "@/types/stock/stock-tansfer";

export function useStockTransferQuery(businessId: ApiId, query?: AdjustmentQuery) {
    return useQuery({
        queryKey: apiQueryKeys.stockTransfer.list(businessId, query),
        queryFn: () => stockTransferApi.list(businessId, query),
        enabled: Boolean(businessId),
    });
}

export function useStockTransfer(businessId: ApiId, transferId: ApiId) {
    return useQuery({
        queryKey: apiQueryKeys.stockTransfer.detail(businessId, transferId),

        queryFn: () => {
            if (!businessId || !transferId) {
                throw new Error("Business ID and Category ID are required");
            }

            return stockTransferApi.get(businessId, transferId);
        },

        enabled: Boolean(businessId && transferId),
    });
}

export function useStockTransferMutation(businessId: ApiId) {
    const queryClient = useQueryClient();

    const invalidate = () =>
        queryClient.invalidateQueries({
            queryKey: apiQueryKeys.stockTransfer.all(businessId),
        });

    const invalidateAfterStockChange = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: apiQueryKeys.stockTransfer.all(businessId),
            }),

            queryClient.invalidateQueries({
                queryKey: apiQueryKeys.productStock.all(businessId),
            }),
        ]);
    };

    return {
        createStockTransfer: useMutation({
            mutationFn: (payload: StockTransferPayload) =>
                stockTransferApi.create(businessId, payload),
            onSuccess: invalidate,
        }),

        updateShip: useMutation({
            mutationFn: (transferId: ApiId) => stockTransferApi.updateShip(businessId, transferId),
            onSuccess: async () => {
                await invalidateAfterStockChange()
            },
        }),

        updateReceive: useMutation({
            mutationFn: (transferId: ApiId) => stockTransferApi.updateReceive(businessId, transferId),
            onSuccess: async () => {
                await invalidateAfterStockChange()
            },
        }),

        updateCancel: useMutation({
            mutationFn: (transferId: ApiId) => stockTransferApi.updateCancel(businessId, transferId),
            onSuccess: async () => {
                await invalidateAfterStockChange()
            },
        }),

    };
}