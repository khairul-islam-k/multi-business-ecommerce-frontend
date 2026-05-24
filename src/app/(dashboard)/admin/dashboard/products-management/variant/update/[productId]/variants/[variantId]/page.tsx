"use client";
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import VariantForm from '../../../../_components/variant-form';
import { VariantPayload } from '@/types/product/variant';
import { useVariant, useVariantMutation } from '@/lib/api/hooks/product-variant';
import { useAuthStore } from '@/stores/auth.store';
import { useSwal } from '@/hooks/use-swal';
import { getApiErrorMessage } from '@/lib/axios';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const UpdateVariant = () => {
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();
    const { productId, variantId } = useParams<{
        productId: string;
        variantId: string;
    }>();

    const [isSubmitting, SetIsSubmitting] = useState<boolean>(false);

    const { data: variant } = useVariant(businessId, productId, variantId);
    const { updateVariant } = useVariantMutation(businessId);

    const handleCreateVariant = async (payload: VariantPayload) => {
        SetIsSubmitting(true);
        try {
            const res = await updateVariant.mutateAsync({
                productId,
                variantId,
                payload
            })
            swal.success("Variant Update Successfully");
            SetIsSubmitting(false);
        } catch (error) {
            swal.error(getApiErrorMessage(error));
            SetIsSubmitting(false);
        }
    };

    return (
        <div className='space-y-6'>
            <PageHeader
                title="Update Product Variant"
                subtitle="Edit variant title, SKU, barcode, price, weight, images, attributes, and status."
                breadcrumb={adminBreadcrumb}
            />

            <VariantForm
                mode="update"
                isSubmitting={isSubmitting}
                initialValues={variant}
                productId={productId}
                onSubmit={handleCreateVariant}
            />
        </div>
    );
};

export default UpdateVariant;