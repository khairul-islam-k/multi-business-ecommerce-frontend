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
};

export default InvoicePage;