import ElectronicReviewPage from '@/app/templates/electronic/pages/electronic-review-page';
import FashionReviewPage from '@/app/templates/fashion/pages/fashion-review-page';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const MyReviews = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })


    if (res?.data?.data?.template === "FASHION") {
        return <FashionReviewPage />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <ElectronicReviewPage />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionReviewPage />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionReviewPage />;
    }
};

export default MyReviews;