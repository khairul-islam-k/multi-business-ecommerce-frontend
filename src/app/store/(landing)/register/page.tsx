import ElectronicRegister from '@/app/templates/electronic/pages/electronic-register';
import FashionRegisterPage from '@/app/templates/fashion/pages/fashion-register';
import React from 'react';

const Register = () => {

    const site = {
        name: "Onecomm Store",
        templateName: "Fashion",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicRegister />
        );
    }

    if (site.templateName === 'Fashion') {
        return (
            <FashionRegisterPage />
        );
    }
};

export default Register;