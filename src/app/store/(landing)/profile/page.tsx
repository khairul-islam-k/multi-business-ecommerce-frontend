import FashionUserProfile from '@/app/templates/fashion/pages/fashion-user-profile';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const MyProfile = async () => {
    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    if (res?.data?.data?.template === "FASHION") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "TOY") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "SHOES") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "GROCERY") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "ELECTRONIC") {
        return <FashionUserProfile />;
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return <FashionUserProfile />;
    }

};

export default MyProfile;