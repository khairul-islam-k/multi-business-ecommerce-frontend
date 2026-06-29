import FashionCustomerAddress from '@/app/templates/fashion/pages/fashion-customer-address';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const CustomerAddress = async () => {
    const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

  if (res?.data?.data?.template === "FASHION") {
    return <FashionCustomerAddress />;
  }
};

export default CustomerAddress;