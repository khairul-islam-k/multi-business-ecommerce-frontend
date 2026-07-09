import FashionAllCart from '@/app/templates/fashion/pages/fashion-all-cart';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const AllCart = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    if (res?.data?.data?.template === "FASHION") {
        return <FashionAllCart />;
    }
};

export default AllCart;