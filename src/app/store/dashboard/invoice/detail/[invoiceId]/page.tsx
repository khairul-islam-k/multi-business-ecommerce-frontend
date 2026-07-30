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

    if (res?.data?.data?.template === "PHARMACY") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "SHOES") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "TOY") {
        return <FashionInvoiceDetails />;
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return <FashionInvoiceDetails />;
    }
};

export default InvoiceDetailsPage;