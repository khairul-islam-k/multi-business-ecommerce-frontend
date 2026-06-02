"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import VariantForm from '../../../../_components/variant-form';
import { VariantPayload } from '@/types/product/variant';
import { useVariant, useVariantMutation } from '@/lib/api/hooks/product-variant';
import { useAuthStore } from '@/stores/auth.store';
import { getApiErrorMessage } from '@/lib/axios';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { App, Empty } from 'antd';
import Loader from '@/components/shared/loader';

const UpdateVariant = () => {
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const { message } = App.useApp();
    const { productId, variantId } = useParams<{
        productId: string;
        variantId: string;
    }>();
    const router = useRouter();

    const [isSubmitting, SetIsSubmitting] = useState<boolean>(false);

    const { data: variant, isLoading, isFetching } = useVariant(businessId, productId, variantId);
    const { updateVariant } = useVariantMutation(businessId);

    const handleCreateVariant = async (payload: VariantPayload) => {
        SetIsSubmitting(true);
        try {
            const res = await updateVariant.mutateAsync({
                productId,
                variantId,
                payload
            })
            message.success("Variant updated successfully.");
            router.push('/admin/dashboard/product-catalog/variant');
            SetIsSubmitting(false);
        } catch (error) {
            message.error(getApiErrorMessage(error));
            SetIsSubmitting(false);
        }
    };

    if (isLoading || isFetching) {
        return <Loader />;
      }
    
      if (!variant) {
        return <Empty description="No products found" />;
      }

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