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
};

export default orderDetailPage;