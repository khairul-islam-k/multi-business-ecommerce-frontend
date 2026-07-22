import ElectronicLogin from '@/app/templates/electronic/pages/electronic-login';
import FashionLoginPage from '@/app/templates/fashion/pages/fashion-login';
import FurnitureLoginPage from '@/app/templates/furniture/pages/furniture-login-page';
import GroceryLoginPage from '@/app/templates/grocery/pages/grocery-login-page';
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
};

export default Login;