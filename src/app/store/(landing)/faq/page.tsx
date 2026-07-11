import FashionFAQ from '@/app/templates/fashion/pages/fashion-faq';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const FrequentlyAskPart = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    if (res?.data?.data?.template === "FASHION") {
        return <FashionFAQ />;
    }
};

export default FrequentlyAskPart;