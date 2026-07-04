import FashionReturn from '@/app/templates/fashion/pages/fashion-return';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const OrderReturn = async () => {
    const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

  if (res?.data?.data?.template === "FASHION") {
    return <FashionReturn />;
  }
};

export default OrderReturn;