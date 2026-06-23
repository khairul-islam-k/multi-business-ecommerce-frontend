import ElectronicAboutPage from '@/app/templates/electronic/pages/abouts';
import React from 'react';

const AboutPage = () => {

    const site = {
        name: "Onecomm Store",
        templateName: "electronic",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicAboutPage />
        );
    }
};

export default AboutPage;
