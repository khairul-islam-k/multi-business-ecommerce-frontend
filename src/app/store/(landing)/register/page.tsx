import ElectronicRegister from '@/app/templates/electronic/pages/electronic-register';
import FashionRegisterPage from '@/app/templates/fashion/pages/fashion-register';
import FurnitureRegisterPage from '@/app/templates/furniture/pages/furniture-register-page';
import GroceryRegisterPage from '@/app/templates/grocery/pages/grocery-register-page';
import PharmacyRegisterPage from '@/app/templates/pharmacy/pages/furniture-register-page';
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

        if (res?.data?.data?.template === "GROCERY") {
            return (
                <GroceryRegisterPage />
            );
        }

        if (res?.data?.data?.template === "FURNITURE") {
            return (
                <FurnitureRegisterPage />
            );
        }

        if (res?.data?.data?.template === "PHARMACY") {
            return (
                <PharmacyRegisterPage />
            );
        }
};

export default Register;