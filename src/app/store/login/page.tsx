import ElectronicLogin from '@/app/templates/electronic/pages/electronic-login';
import React from 'react';

const Login = () => {

    const site = {
        name: "Onecomm Store",
        templateName: "electronic",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicLogin />
        );
    }
};

export default Login;