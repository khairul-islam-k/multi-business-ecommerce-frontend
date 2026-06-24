import ElectronicHomePage from '@/app/templates/electronic/pages/home-page';
import FashionHomePage from '@/app/templates/fashion/pages/home-page';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const Homepage = async () => {

  const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

  if (res?.data?.data?.template === "ELECTRONIC") {
    return <ElectronicHomePage />;
  }

  if (res?.data?.data?.template === "FASHION") {
    return <FashionHomePage />;
  }

};

export default Homepage;