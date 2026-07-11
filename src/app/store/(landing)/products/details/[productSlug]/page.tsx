import ViewFashionProduct from '@/app/templates/fashion/pages/view-product';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const ProductView = async () => {

    const header = await headers()
    
        const res = await publicApi.get('/storefront/resolve', {
            headers: {
                host: header.get('host') || ""
            }
        })

    if (res?.data?.data?.template === "FASHION") {
        return <ViewFashionProduct />
    }

};

export default ProductView;