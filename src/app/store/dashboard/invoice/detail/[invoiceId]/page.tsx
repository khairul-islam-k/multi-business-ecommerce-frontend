import ElectronicInvoiceDetails from '@/app/templates/electronic/pages/electronic-invoice-details';
import FashionInvoiceDetails from '@/app/templates/fashion/pages/fashion-invoice-details';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const InvoiceDetailsPage = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicInvoiceDetails />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionInvoiceDetails />;
    }
};

export default InvoiceDetailsPage;