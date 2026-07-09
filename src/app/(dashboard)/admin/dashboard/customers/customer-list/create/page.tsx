'use client';
import React, { useState } from 'react';
import CustomerForm from '../_components/customer-form';
import { CustomerPayload } from '@/types/customer/customer';
import { useCustomerMutation } from '@/lib/api/hooks/customer';
import { useAuthStore } from '@/stores/auth.store';
import { useSwal } from '@/hooks/use-swal';
import { getApiErrorMessage } from '@/lib/axios';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';
import { useRouter } from 'next/navigation';

const CreateCustomer = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const business = useAuthStore((s) => s.selectedBusiness);
    const businessId = business?.id ?? "";
    const swal = useSwal();
    const router = useRouter();

    const { createCustomer } = useCustomerMutation(businessId);

    const handleSubmit = async (values: CustomerPayload) => {
        if (!businessId) {
            swal.error("Business not selected.");
            return;
        }

        setLoading(true);

        try {
            await createCustomer.mutateAsync(values);
            router.push('/admin/dashboard/customers/customer-list');
            swal.success("Customer created successfully.");
        } catch (error) {
            swal.error(getApiErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-6'>

            <PageHeader
                title="Create Customer"
                subtitle="Add a new customer with name, email, phone, status, and note."
                breadcrumb={adminBreadcrumb}
            />

            <CustomerForm
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default CreateCustomer;