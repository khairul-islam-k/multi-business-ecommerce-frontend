"use client";
import React, { useState } from 'react';
import CustomerForm from '../../_components/customer-form';
import { CustomerPayload } from '@/types/customer/customer';
import PageHeader from '@/components/shared/page-header';
import { adminBreadcrumb } from '@/config/breadcrumb.config';

const customer = {
    name: "John Wick",
    email: "john@example.com",
    phone: "+8801700000000",
    status: "ACTIVE",
    note: "Frequent buyer"
};

const UpdateCustomer = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (values: CustomerPayload) => {
        console.log('value', values)
    }

    return (
        <div className='space-y-6'>

            <PageHeader
                title="Update Customer"
                subtitle="Modify customer information, contact details, status, and note."
                breadcrumb={adminBreadcrumb}
            />

            <CustomerForm
                initialData={customer}
                loading={loading}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default UpdateCustomer;