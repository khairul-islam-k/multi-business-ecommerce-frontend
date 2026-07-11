import ElectronicContactClient from '@/app/templates/electronic/pages/contact-page';
import FashionContactPage from '@/app/templates/fashion/pages/contact-page';
import React from 'react';

const ContactUs = () => {
    
    const site = {
        name: "Onecomm Store",
        templateName: "fashion",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicContactClient />
        );
    }

    if (site.templateName === 'fashion') {
        return (
            <FashionContactPage />
        );
    }
};

export default ContactUs;