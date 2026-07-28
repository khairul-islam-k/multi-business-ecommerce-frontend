import ElectronicCreateCustomerAddress from '@/app/templates/electronic/pages/electronic-create-customer-address';
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

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicCreateCustomerAddress />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionCreateCustomerAddress />;
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return <FashionCreateCustomerAddress />;
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <FashionCreateCustomerAddress />;
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <FashionCreateCustomerAddress />;
    }

    if (res?.data?.data?.template === "SHOES") {
        return <FashionCreateCustomerAddress />;
    }

    if (res?.data?.data?.template === "TOY") {
        return <FashionCreateCustomerAddress />;
    }
};

export default CreateCustomerAddress;