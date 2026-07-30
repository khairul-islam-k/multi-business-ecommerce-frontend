import CosmeticsLoginPage from '@/app/templates/cosmetics/pages/cosmetics-login-page';
import ElectronicLogin from '@/app/templates/electronic/pages/electronic-login';
import FashionLoginPage from '@/app/templates/fashion/pages/fashion-login';
import FurnitureLoginPage from '@/app/templates/furniture/pages/furniture-login-page';
import GroceryLoginPage from '@/app/templates/grocery/pages/grocery-login-page';
import PharmacyLoginPage from '@/app/templates/pharmacy/pages/pharmacy-login-page';
import RestaurantLoginPage from '@/app/templates/restaurant/pages/restaurant-login-page';
import ShoesLoginPage from '@/app/templates/shoes/pages/shoes-login-page';
import ToyLoginPage from '@/app/templates/toy/pages/toy-login-page';
import VehicleLoginPage from '@/app/templates/vehicle/pages/vehicle-login-page';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const Login = async () => {

    const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })

    if (res?.data?.data?.template === "ELECTRONIC") {
        return (
            <ElectronicLogin />
        );
    }

    if (res?.data?.data?.template === "FASHION") {
        return (
            <FashionLoginPage />
        );
    }

    if (res?.data?.data?.template === "GROCERY") {
        return (
            <GroceryLoginPage />
        );
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return (
            <FurnitureLoginPage />
        );
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return (
            <PharmacyLoginPage />
        );
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return (
            <VehicleLoginPage />
        );
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return (
            <CosmeticsLoginPage />
        );
    }

    if (res?.data?.data?.template === "SHOES") {
        return (
            <ShoesLoginPage />
        );
    }

    if (res?.data?.data?.template === "TOY") {
        return (
            <ToyLoginPage />
        );
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return (
            <RestaurantLoginPage />
        );
    }
};

export default Login;