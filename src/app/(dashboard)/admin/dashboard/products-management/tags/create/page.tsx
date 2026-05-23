"use client";

import PageHeader from "@/components/shared/page-header";
import TagForm, { TagPayload } from "../_components/TagForm";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useAuthStore } from "@/stores/auth.store";
import { useTagsMutation } from "@/lib/api/hooks/product-tags";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";

const CreateTagPage = () => {
    const business = useAuthStore(s => s.selectedBusiness);
    const businessId = business?.id ? business?.id : '';
    const { createTags } = useTagsMutation(businessId);
    const swal = useSwal();

    const handleCreateTag = async (values: TagPayload) => {
        const payload: TagPayload = {
            name: values.name.trim(),
            status: values.status,
        };

        try {
            const res = await createTags.mutateAsync(payload);
            swal.success('Tags Create successfully');
        } catch (error) {
            swal.success(getApiErrorMessage(error));
        }
    };

    return (
        <div className='space-y-6'>
            <PageHeader
                title="Create Product Tag"
                subtitle="Add a new product tag to organize, filter, and group products."
                breadcrumb={adminBreadcrumb}
            />

            <TagForm mode="create" onSubmit={handleCreateTag} />
        </div>
    );
};

export default CreateTagPage;