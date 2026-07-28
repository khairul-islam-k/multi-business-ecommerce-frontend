import ElectronicProductDetails from '@/app/templates/electronic/pages/electronic-product-details';
import ViewFashionProduct from '@/app/templates/fashion/pages/view-product';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const ProductView = async () => {

    const header = await headers()
    
        const res = await publicApi.get('/storefront/resolve', {
            headers: {
                host: header.get('host') || ""
            }
        })

    if (res?.data?.data?.template === "FASHION") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicProductDetails />
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "SHOES") {
        return <ViewFashionProduct />
    }

    if (res?.data?.data?.template === "TOY") {
        return <ViewFashionProduct />
    }

};

export default ProductView;