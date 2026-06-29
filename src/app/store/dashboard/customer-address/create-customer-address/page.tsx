import FashionCreateCustomerAddress from '@/app/templates/fashion/pages/fashion-create-customer-address';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const CreateCustomerAddress = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    if (res?.data?.data?.template === "FASHION") {
        return <FashionCreateCustomerAddress />;
    }
};

export default CreateCustomerAddress;