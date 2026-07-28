import FashionHomePage from '@/app/templates/fashion/pages/home-page';
import React from 'react';
import { headers } from 'next/headers';
import { publicApi } from '@/lib/axios';
import ElectronicHomePage from '@/app/templates/electronic/pages/home-page';
import GroceryHome from '@/app/templates/grocery/pages/grocery-home';
import FurnitureHome from '@/app/templates/furniture/pages/furniture-home';
import PharmacyHome from '@/app/templates/pharmacy/pages/pharmacy-home';
import VehicleHome from '@/app/templates/vehicle/pages/vehicle-home';
import CosmeticsHomePage from '@/app/templates/cosmetics/pages/cosmetics-home-page';
import ShoesHomePage from '@/app/templates/shoes/pages/shoes-home-page';
import ToyHomePage from '@/app/templates/toy/pages/toy-home-page';

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

  if (res?.data?.data?.template === "PHARMACY") {
    return <PharmacyHome resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "VEHICLE") {
    return <VehicleHome resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "COSMETICS") {
    return <CosmeticsHomePage resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "SHOES") {
    return <ShoesHomePage resolveData={res?.data?.data} />;
  }

  if (res?.data?.data?.template === "TOY") {
    return <ToyHomePage resolveData={res?.data?.data} />;
  }

};

export default Homepage;