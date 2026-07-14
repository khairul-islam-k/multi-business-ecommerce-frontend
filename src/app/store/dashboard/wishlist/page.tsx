import ElectronicWishList from '@/app/templates/electronic/pages/electronic-wish-list';
import FashionWishList from '@/app/templates/fashion/pages/fashion-wish-list';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const WishListPage = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicWishList />;
    }
};

export default WishListPage;