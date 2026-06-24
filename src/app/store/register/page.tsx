import ElectronicRegister from '@/app/templates/electronic/pages/electronic-register';
import React from 'react';

const Register = () => {

    const site = {
        name: "Onecomm Store",
        templateName: "electronic",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicRegister />
        );
    }
};

export default Register;