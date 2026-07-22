import ElectronicInvoice from '@/app/templates/electronic/pages/electronic-invoice';
import FashionInvoice from '@/app/templates/fashion/pages/fashion-invoice';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const InvoicePage = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionInvoice />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicInvoice />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionInvoice />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionInvoice />;
    }
};

export default InvoicePage;