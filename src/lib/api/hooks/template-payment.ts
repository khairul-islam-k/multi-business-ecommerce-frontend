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
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.paymentTemplate.all(),
      }),

      queryClient.invalidateQueries({
        queryKey: apiQueryKeys.addCart.all(),
      }),
    ]);
  };

  return {
    createPayment: useMutation({
      mutationFn: (payload: PaymentPayload) =>
        templatePaymentApi.create(payload),
      onSuccess: async () => {
        await invalidate();
      },
    }),

    createProvidePayment: useMutation({
      mutationFn: ({
        orderId,
        payload
      }: {
        orderId: ApiId;
        payload: PaymentInitPayload;
      }) =>
        templatePaymentApi.createProvidePayment(orderId, payload),
      onSuccess: async () => {
        await invalidate();
      },
    }),

    // updateBrand: useMutation({
    //   mutationFn: ({
    //     brandId,
    //     payload,
    //   }: {
    //     brandId: ApiId;
    //     payload: BrandPayload;
    //   }) => productBrandApi.update(businessId, brandId, payload),
    //   onSuccess: invalidate,
    // }),

    // removeBrand: useMutation({
    //   mutationFn: (brandId: ApiId) =>
    //     productBrandApi.remove(businessId, brandId),
    //   onSuccess: invalidate,
    // }),

  };
}