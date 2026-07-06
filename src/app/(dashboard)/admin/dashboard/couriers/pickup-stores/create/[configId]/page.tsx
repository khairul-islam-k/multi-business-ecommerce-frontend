"use client";

import { App } from "antd";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { getApiErrorMessage } from "@/lib/axios";
import PickupStoreForm from "../../_components/pickup-store-form";
import { PickupStorePayload } from "@/types/courier/courier";
import { useParams, useRouter } from "next/navigation";
import { useCourierMutation } from "@/lib/api/hooks/courier";
import { useAuthStore } from "@/stores/auth.store";

const CreatePickupStorePage = () => {
    const { message } = App.useApp();
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const router = useRouter();

    const { configId } = useParams<{ configId: string }>();

    const { createPickupStore } = useCourierMutation(businessId);

    const handleCreate = async (payload: PickupStorePayload) => {
        try {
            console.log("create payload", payload);

           await createPickupStore.mutateAsync({
                configId,
                payload
            });

            router.push('/admin/dashboard/couriers/pickup-stores');

            message.success("Pickup store created successfully");
        } catch (error) {
            message.error(getApiErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Pickup Store"
                subtitle="Create a courier pickup store for your business."
                breadcrumb={adminBreadcrumb}
            />

            <PickupStoreForm
                configId={configId}
                mode="create"
                onSubmit={handleCreate} />
        </div>
    );
};

export default CreatePickupStorePage;