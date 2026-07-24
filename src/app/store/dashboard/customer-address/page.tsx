import ElectronicCustomerAddress from '@/app/templates/fashion/pages/electronic-customer-address';
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

  if (res?.data?.data?.template === "ELECTRONIC") {
    return <ElectronicCustomerAddress />;
  }

  if (res?.data?.data?.template === "GROCERY") {
    return <FashionCustomerAddress />;
  }

  if (res?.data?.data?.template === "FURNITURE") {
    return <FashionCustomerAddress />;
  }

  if (res?.data?.data?.template === "PHARMACY") {
    return <FashionCustomerAddress />;
  }
};

export default CustomerAddress;