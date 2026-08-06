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

    const privacy = res.data.data.config.generalConfig.extraPage.about;

    if (res?.data?.data?.template === "FASHION") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "TOY") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "SHOES") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return <FashionPrivacy privacy={privacy} />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <FashionPrivacy privacy={privacy} />;
    }
};

export default PrivacyPolicy;