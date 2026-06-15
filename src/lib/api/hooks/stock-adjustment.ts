import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { stockAdjustmentApi } from "../stock-adjustment";
import { AdjustmentQuery, StockAdjustmentPayload } from "@/types/stock/adjustment";

export function useStockAdjustmentQuery(businessId: ApiId, query?: AdjustmentQuery) {
    return useQuery({
        queryKey: apiQueryKeys.stockAdjustment.list(businessId, query),
        queryFn: () => stockAdjustmentApi.list(businessId, query),
        enabled: Boolean(businessId),
    });
}

export function useStockAdjustment(businessId: ApiId, adjustmentId: ApiId) {
    return useQuery({
        queryKey: apiQueryKeys.stockAdjustment.detail(businessId, adjustmentId),

        queryFn: () => {
            if (!businessId || !adjustmentId) {
                throw new Error("Business ID and Category ID are required");
            }

            return stockAdjustmentApi.get(businessId, adjustmentId);
        },

        enabled: Boolean(businessId && adjustmentId),
    });
}

export function useStockAdjustmentMutation(businessId: ApiId) {
    const queryClient = useQueryClient();

    const invalidate = () =>
        queryClient.invalidateQueries({
            queryKey: apiQueryKeys.stockAdjustment.all(businessId),
        });

    const invalidateAfterStockChange = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: apiQueryKeys.stockAdjustment.all(businessId),
            }),

            queryClient.invalidateQueries({
                queryKey: apiQueryKeys.productStock.all(businessId),
            }),
        ]);
    };

    return {
        createStockAdjustment: useMutation({
            mutationFn: (payload: StockAdjustmentPayload) =>
                stockAdjustmentApi.create(businessId, payload),
            onSuccess: invalidate,
        }),

        updateApprove: useMutation({
            mutationFn: (adjustmentId: ApiId) => stockAdjustmentApi.updateApprove(businessId, adjustmentId),
            onSuccess: async () => {
                await invalidateAfterStockChange()
            },
        }),

        updateCancel: useMutation({
            mutationFn: (adjustmentId: ApiId) => stockAdjustmentApi.updateCancel(businessId, adjustmentId),
            onSuccess: async () => {
                await invalidateAfterStockChange()
            },
        }),

    };
}