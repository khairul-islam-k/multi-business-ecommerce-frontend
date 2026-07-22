import ElectronicActiveCart from '@/app/templates/electronic/pages/electronic-active-cart';
import FashionActiveCart from '@/app/templates/fashion/pages/fashion-active-cart';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const ActiveCart = async () => {

    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionActiveCart />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicActiveCart />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionActiveCart />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionActiveCart />;
    }
};

export default ActiveCart;