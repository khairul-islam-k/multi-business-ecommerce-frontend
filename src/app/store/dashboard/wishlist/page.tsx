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

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "SHOES") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "TOY") {
        return <FashionWishList />;
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return <FashionWishList />;
    }
};

export default WishListPage;