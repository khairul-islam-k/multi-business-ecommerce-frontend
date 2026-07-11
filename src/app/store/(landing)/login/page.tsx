import ElectronicLogin from '@/app/templates/electronic/pages/electronic-login';
import FashionLoginPage from '@/app/templates/fashion/pages/fashion-login';
import React from 'react';

const Login = () => {

    const site = {
        name: "Onecomm Store",
        templateName: "Fashion",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicLogin />
        );
    }

    if (site.templateName === 'Fashion') {
        return (
            <FashionLoginPage />
        );
    }
};

export default Login;