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
};

export default MyReviews;