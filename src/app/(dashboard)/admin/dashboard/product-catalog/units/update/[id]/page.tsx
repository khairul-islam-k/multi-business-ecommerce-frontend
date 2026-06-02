"use client";

import { UnitPayload } from "@/types/product/unit";
import UnitForm from "../../_components/UnitForm";
import { useParams } from "next/navigation";
import { useUnit, useUnitMutation } from "@/lib/api/hooks/product-unit";
import { useAuthStore } from "@/stores/auth.store";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { App } from "antd";

const UpdateUnitPage = () => {
    const { id } = useParams<{ id: string }>();
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const { message } = App.useApp();

    const { data: unit } = useUnit(businessId, id);
    const { updateUnit } = useUnitMutation(businessId);


    const handleUpdateUnit = async (values: UnitPayload) => {
        const payload: UnitPayload = {
            name: values.name.trim(),
            status: values.status,
        };

        try {
            await updateUnit.mutateAsync({ unitId: id, payload });
            message.success('Unit Updated Successfully');
        } catch (error) {
            message.error(getApiErrorMessage(error));
        }
        console.log("Update unit payload:", payload);
    };

    return (
        <div>
            <div style={{
                marginBottom: '15px'
            }}>
                <PageHeader title="Unit update" breadcrumb={adminBreadcrumb} />
            </div>

            <UnitForm
                mode="update"
                initialValues={unit}
                onSubmit={handleUpdateUnit}
            />
        </div>
    );
};

export default UpdateUnitPage;