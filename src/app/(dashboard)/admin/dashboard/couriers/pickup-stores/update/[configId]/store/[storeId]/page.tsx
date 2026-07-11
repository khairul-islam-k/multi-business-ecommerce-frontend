"use client";

import { App } from "antd";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useCourierMutation, useCourierPickUp } from "@/lib/api/hooks/courier";
import { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { PickupStorePayload } from "@/types/courier/courier";

import PickupStoreForm from "../../../../_components/pickup-store-form";

const UpdatePickupStorePage = () => {
  const { message } = App.useApp();
  const { configId, storeId } = useParams<{
    configId: string;
    storeId: string;
  }>();

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { data: pickUpStores } = useCourierPickUp(businessId, configId);

  const { updatePickupStore } = useCourierMutation(businessId);

  const selectedPickupStore = useMemo(() => {
    return pickUpStores?.pickup_stores?.find(
      (store) => String(store.id) === String(storeId),
    );
  }, [pickUpStores?.pickup_stores, storeId]);

  const handleUpdate = async (payload: PickupStorePayload) => {
    try {
      await updatePickupStore.mutateAsync({
        configId,
        storeId,
        payload,
      });

      message.success("Pickup store updated successfully");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Pickup Store"
        subtitle="Update courier pickup store information."
        breadcrumb={adminBreadcrumb}
      />

      <PickupStoreForm
        configId={configId}
        mode="update"
        initialValues={selectedPickupStore}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default UpdatePickupStorePage;
