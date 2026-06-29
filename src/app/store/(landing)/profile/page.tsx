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
};

export default MyProfile;