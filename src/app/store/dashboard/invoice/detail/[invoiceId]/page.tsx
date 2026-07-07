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
};

export default InvoiceDetailsPage;