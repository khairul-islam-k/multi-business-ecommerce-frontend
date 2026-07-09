import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId } from "../types";
import { CourierDeliveryPayload } from "@/types/courier/courier";
import { templateCourierApi } from "../template-courier";

export function useTemplateCourierQuery() {
  return useQuery({
    queryKey: apiQueryKeys.templateCourier.list(),
    queryFn: () => templateCourierApi.listCourier(),
  });
}


export function useTemplateAreasQuery(configId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.templateCourier.listArea(configId),

    queryFn: () => {
      if (!configId) {
        throw new Error("Business ID and Category ID are required");
      }

      return templateCourierApi.getAreas(configId);
    },

    enabled: Boolean(configId),
  });
}


export function useTemplateCourierMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.templateCourier.all(),
    });

  return {
    courierChargeCalculate: useMutation({
      mutationFn: ({
        configId,
        payload
      }:{
        configId: ApiId;
        payload: CourierDeliveryPayload
      }) =>
        templateCourierApi.shippingCharge(configId, payload),
      onSuccess: invalidate,
    }),

  };
}