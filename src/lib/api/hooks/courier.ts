import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiQueryKeys } from "../query-keys";
import { ApiId, CategoriesQuery } from "../types";
import { courierApi } from "../courier";
import { AssignToCourierPayload, PickupStorePayload, ShipmentQuery, UpdateCourierConfigPayload } from "@/types/courier/courier";

export function useCourierProviderQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.list(businessId, query),
    queryFn: () => courierApi.listProvider(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useShipmentQuery(businessId: ApiId, query?: ShipmentQuery) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.listShipment(businessId, query),
    queryFn: () => courierApi.listShipment(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useCourierQuery(businessId: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.configs(businessId, query),
    queryFn: () => courierApi.list(businessId, query),
    enabled: Boolean(businessId),
  });
}

export function useShippingDetails(businessId: ApiId, shippingId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.shippingDetails(businessId, shippingId),

    queryFn: () => {
      if (!businessId || !shippingId) {
        throw new Error("Business ID and Category ID are required");
      }

      return courierApi.shipmentDetails(businessId, shippingId);
    },

    enabled: Boolean(businessId && shippingId),
  });
}

export function useShipmentTracking(businessId: ApiId, shippingId: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.shippingDetails(businessId, shippingId),

    queryFn: () => {
      if (!businessId || !shippingId) {
        throw new Error("Business ID and Category ID are required");
      }

      return courierApi.shipmentTracking(businessId, shippingId);
    },

    enabled: Boolean(businessId && shippingId),
  });
}


export function useAreasQuery(businessId: ApiId, courier: ApiId, query?: CategoriesQuery) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.listAreas(businessId, courier, query),

    queryFn: () => {
      if (!businessId || !courier) {
        throw new Error("Business ID and Category ID are required");
      }

      return courierApi.getAreas(businessId, courier, query);
    },

    enabled: Boolean(businessId && courier),
  });
}

export function useCourierPickUp(businessId: ApiId, courier: ApiId) {
  return useQuery({
    queryKey: apiQueryKeys.courierConfig.pickUp(businessId, courier),

    queryFn: () => {
      if (!businessId || !courier) {
        throw new Error("Business ID and Category ID are required");
      }

      return courierApi.getPickUp(businessId, courier);
    },

    enabled: Boolean(businessId && courier),
  });
}

export function useCourierMutation(businessId: ApiId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: apiQueryKeys.courierConfig.all(businessId),
    });

  return {
    courierBulkUpdate: useMutation({
      mutationFn: (payload: UpdateCourierConfigPayload) =>
        courierApi.updateBulk(businessId, payload),
      onSuccess: invalidate,
    }),

    createPickupStore: useMutation({
      mutationFn: ({
        configId,
        payload
      }: {
        configId: ApiId;
        payload: PickupStorePayload
      }) =>
        courierApi.createPickUp(businessId, configId, payload),
      onSuccess: invalidate,
    }),

    courierAssign: useMutation({
      mutationFn: ({
        orderId,
        payload
      }: {
        orderId: ApiId;
        payload: AssignToCourierPayload
      }) =>
        courierApi.courierAssign(businessId, orderId, payload),
      onSuccess: invalidate,
    }),

    shipmentBook: useMutation({
      mutationFn: (shippingId: ApiId) =>
        courierApi.shipmentBook(businessId, shippingId),
      onSuccess: invalidate,
    }),

    updatePickupStore: useMutation({
      mutationFn: ({
        configId,
        storeId,
        payload,
      }: {
        configId: ApiId;
        storeId: ApiId;
        payload: PickupStorePayload;
      }) => courierApi.updatePickUp(businessId, configId, storeId, payload),
      onSuccess: invalidate,
    }),

    removePickUpStore: useMutation({
      mutationFn: ({
        configId,
        storeId
      }: {
        configId: ApiId;
        storeId: ApiId;
      }) =>
        courierApi.removePickUpStore(businessId, configId, storeId),
      onSuccess: invalidate,
    }),

  };
}