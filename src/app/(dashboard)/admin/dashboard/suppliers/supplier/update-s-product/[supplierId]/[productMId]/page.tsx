"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import SupplierProductForm from '../../../_components/add-supplier-product-form';
import { useAuthStore } from '@/stores/auth.store';
import { useSwal } from '@/hooks/use-swal';
import { useSupplierProduct, useSupplierProductMutation } from '@/lib/api/hooks/supplier-product';
import { SupplierProductPayload } from '@/types/suppliers/supplier-product';
import { getApiErrorMessage } from '@/lib/axios';
import Loader from '@/components/shared/loader';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const UpdateSupplierProduct = () => {
    const { supplierId, productMId } = useParams<{
        supplierId: string;
        productMId: string;
    }>();

    const [loading, setLoading] = useState<boolean>(false);

    console.log('data', supplierId, productMId)
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();
    const router = useRouter();

    const { data: products, isLoading, isFetching } = useSupplierProduct(businessId, supplierId, productMId);

    const { updateSupplierProduct } = useSupplierProductMutation(businessId);

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
            const res = await updateSupplierProduct.mutateAsync({
                supplierId,
                productMId,
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

    if (isLoading || isFetching) return <Loader />

    return (
        <div className='spacey-6'>

            <PageHeader
                title="Update Supplier Product"
                subtitle="Modify supplier product mapping, variant, supplier SKU, purchase price, minimum order quantity, lead time, and status."
                breadcrumb={adminBreadcrumb}
            />

            <SupplierProductForm
                initialData={products}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default UpdateSupplierProduct;