import FashionPrivacy from '@/app/templates/fashion/pages/fashion-privacy';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const PrivacyPolicy = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    const privacy = res.data.data.config.generalConfig.extraPage.termsAndConditions;

    if (res?.data?.data?.template === "FASHION") {
        return <FashionPrivacy privacy={privacy} />;
    }
};

export default PrivacyPolicy;