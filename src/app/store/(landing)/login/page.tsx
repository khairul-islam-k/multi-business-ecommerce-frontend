import ElectronicLogin from '@/app/templates/electronic/pages/electronic-login';
import FashionLoginPage from '@/app/templates/fashion/pages/fashion-login';
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
};

export default Login;