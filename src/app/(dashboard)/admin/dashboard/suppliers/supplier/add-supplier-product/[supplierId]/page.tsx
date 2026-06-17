"use client";
import { SupplierProductPayload } from '@/types/suppliers/supplier-product';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import SupplierProductForm from '../../_components/add-supplier-product-form';
import { useSupplierProductMutation } from '@/lib/api/hooks/supplier-product';
import { useAuthStore } from '@/stores/auth.store';
import { useSwal } from '@/hooks/use-swal';
import { getApiErrorMessage } from '@/lib/axios';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const AddSupplierProduct = () => {
    const { supplierId } = useParams<{ supplierId: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();
    const router = useRouter();

    const { createProduct } = useSupplierProductMutation(businessId)

    const handleSubmit = async (values: SupplierProductPayload) => {
        if (!businessId) {
            swal.error("Business not selected.");
            return;
        }

        if (!supplierId) {
            swal.error("Supplier not found.");
            return;
        }

        setLoading(true);

        try {
            const res = await createProduct.mutateAsync({
                supplierId,
                payload: values,
            });

            console.log('res', res);
            swal.success("Supplier product added successfully.");

            router.push(`/admin/dashboard/suppliers/supplier/product/${supplierId}`);
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-6'>

            <PageHeader
                title="Add Supplier Product"
                subtitle="Map a product or variant to this supplier with SKU, purchase price, minimum order quantity, lead time, and status."
                breadcrumb={adminBreadcrumb}
            />

            <SupplierProductForm
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AddSupplierProduct;