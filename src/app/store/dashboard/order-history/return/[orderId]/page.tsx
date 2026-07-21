import ElectronicOrderReturn from '@/app/templates/electronic/pages/electronic-order-return';
import FashionOrderReturn from '@/app/templates/fashion/pages/fashion-order-return';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const ReturnPage = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionOrderReturn />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicOrderReturn />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionOrderReturn />;
    }
};

export default ReturnPage;