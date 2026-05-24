"use client";

import { UnitPayload } from "@/types/product/unit";
import TagForm from "../../_components/TagForm";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useTags, useTagsMutation } from "@/lib/api/hooks/product-tags";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { App } from "antd";


const UpdateTagPage = () => {
    const { id } = useParams<{ id: string }>();
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const { message } = App.useApp();

    const { data: tag } = useTags(businessId, id);
    const { updateTags } = useTagsMutation(businessId);

    const handleUpdateTag = async (values: UnitPayload) => {
        const payload: UnitPayload = {
            name: values.name.trim(),
            status: values.status,
        };

        try {
            await updateTags.mutateAsync({
                tagId: id,
                payload,
            });
            message.success('Tag Update successfully');
        } catch (error) {
            message.error(getApiErrorMessage(error))
        }
    };

    return (
        <div className='space-y-6'>
            <PageHeader
                title="Update Product Tag"
                subtitle="Edit product tag information, status, and product organization settings."
                breadcrumb={adminBreadcrumb}
            />
            <TagForm
                mode="update"
                initialValues={tag}
                onSubmit={handleUpdateTag}
            />
        </div>
    );
};

export default UpdateTagPage;