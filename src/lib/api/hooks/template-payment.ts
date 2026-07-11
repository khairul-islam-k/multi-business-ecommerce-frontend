import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { templatePaymentApi } from "../template-payment";
import { PaymentInitPayload, PaymentPayload } from "@/types/template/template-payment";

export function useTemplatePaymentGateway() {
  return useQuery({
    queryKey: apiQueryKeys.paymentTemplate.list(),
    queryFn: () => templatePaymentApi.list(),
  });
}

// export function useBrand(businessId: ApiId, brandId: ApiId) {
//   return useQuery({
//     queryKey: apiQueryKeys.ProductCategories.detail(businessId, brandId),

//     queryFn: () => {
//       if (!businessId || !brandId) {
//         throw new Error("Business ID and Category ID are required");
//       }

//       return productBrandApi.get(businessId, brandId);
//     },

//     enabled: Boolean(businessId && brandId),
//   });
// }

export function useTemplatePaymentMutation() {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.cancelQueries({
      queryKey: apiQueryKeys.addCart.detailActive(),
      exact: true,
    });

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.paymentTemplate.all(),
        exact: false,
        refetchType: "all",
      }),

      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.addCart.all(),
        exact: false,
        refetchType: "all",
      }),
    ]);

    await queryClient.refetchQueries({
      queryKey: apiQueryKeys.addCart.detailActive(),
      exact: true,
      type: "all",
    });
  };

  return {
    createPayment: useMutation({
      mutationFn: async (payload: PaymentPayload) => {
        return templatePaymentApi.create(payload);
      },

      onSuccess: async () => {
        await invalidate();
      },
    }),

    createProvidePayment: useMutation({
      mutationFn: async ({
        orderId,
        payload,
      }: {
        orderId: ApiId;
        payload: PaymentInitPayload;
      }) => {
        return templatePaymentApi.createProvidePayment(orderId, payload);
      },

      onSuccess: async () => {
        await invalidate();
      },
    }),
  };
}