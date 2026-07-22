import FashionHomePage from '@/app/templates/fashion/pages/home-page';
import React from 'react';
import { headers } from 'next/headers';
import { publicApi } from '@/lib/axios';
import ElectronicHomePage from '@/app/templates/electronic/pages/home-page';
import GroceryHome from '@/app/templates/grocery/pages/grocery-home';
import FurnitureHome from '@/app/templates/furniture/pages/furniture-home';

const Homepage = async () => {

  const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

  if (res?.data?.data?.template === "ELECTRONIC") {
    return <ElectronicHomePage resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "FASHION") {
    return <FashionHomePage resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "GROCERY") {
    return <GroceryHome resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "FURNITURE") {
    return <FurnitureHome resolveData={res?.data?.data} />;
  }

};

export default Homepage;