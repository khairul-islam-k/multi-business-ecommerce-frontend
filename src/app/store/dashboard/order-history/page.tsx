import ElectronicOrderHistory from '@/app/templates/electronic/pages/Electronic-order-histrory';
import FashionOrderHistory from '@/app/templates/fashion/pages/fashion-order-history';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const OrderHistoryPage = async () => {
    const header = await headers()
    
        const res = await publicApi.get('/storefront/resolve', {
            headers: {
                host: header.get('host') || ""
            }
        })
    
    
        if (res?.data?.data?.template === "FASHION") {
            return <FashionOrderHistory />;
        }

        if (res?.data?.data?.template === "ELECTRONIC") {
            return <ElectronicOrderHistory />;
        }
};

export default OrderHistoryPage;