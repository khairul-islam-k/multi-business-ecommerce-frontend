"use client";

import { useUnitMutation } from "@/lib/api/hooks/product-unit";
import UnitForm, { UnitPayload } from "../_components/UnitForm";
import { useAuthStore } from "@/stores/auth.store";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const CreateUnitPage = () => {
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const { createUnit } = useUnitMutation(businessId);
    const swal = useSwal();

    const handleCreateUnit = async (values: UnitPayload) => {
        const payload: UnitPayload = {
            name: values.name.trim(),
            status: values.status,
        };

        try {
            const res = await createUnit.mutateAsync(payload);
            swal.success("create unit successfully");
            console.log("Create unit payload:", res);
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Product Unit"
                subtitle="Add a new product unit with name and status."
                breadcrumb={adminBreadcrumb}
            />
            <UnitForm mode="create" onSubmit={handleCreateUnit} />
        </div>
    );
};

export default CreateUnitPage;