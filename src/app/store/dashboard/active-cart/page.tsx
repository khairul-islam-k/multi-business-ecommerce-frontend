import FashionActiveCart from '@/app/templates/fashion/pages/fashion-active-cart';
import { useAddActiveCArt } from '@/lib/api/hooks/add-cart';
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
};

export default ActiveCart;