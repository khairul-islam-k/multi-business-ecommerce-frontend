import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePosSalePayload } from "@/types/pos";
import { apiQueryKeys } from "../query-keys";
import { posApi } from "../pos";
import { ApiId } from "../types";

export function usePosSaleMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePosSalePayload) =>
      posApi.createSale(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.Product.all(businessId),
      });
      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.productStock.all(businessId),
      });
    },
  });
}
