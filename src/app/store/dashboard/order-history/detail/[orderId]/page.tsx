import ElectronicOrderDetail from '@/app/templates/electronic/pages/electronic-order-details';
import FashionOrderDetail from '@/app/templates/fashion/pages/fashion-order-detail';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const orderDetailPage = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicOrderDetail />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "SHOES") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "TOY") {
        return <FashionOrderDetail />;
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return <FashionOrderDetail />;
    }
};

export default orderDetailPage;