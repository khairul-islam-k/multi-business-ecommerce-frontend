import ElectronicRegister from '@/app/templates/electronic/pages/electronic-register';
import FashionRegisterPage from '@/app/templates/fashion/pages/fashion-register';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const Register = async () => {

    const header = await headers()
    
      const res = await publicApi.get('/storefront/resolve', {
        headers: {
          host: header.get('host') || ""
        }
      })
    
        if (res?.data?.data?.template === "ELECTRONIC") {
            return (
                <ElectronicRegister />
            );
        }
    
        if (res?.data?.data?.template === "FASHION") {
            return (
                <FashionRegisterPage />
            );
        }
};

export default Register;