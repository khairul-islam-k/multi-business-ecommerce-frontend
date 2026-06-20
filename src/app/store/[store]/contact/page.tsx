import ElectronicContactClient from '@/app/templates/electronic/pages/contact-page';
import React from 'react';

const ContactUs = () => {
    
    const site = {
        name: "Onecomm Store",
        templateName: "electronic",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicContactClient />
        );
    }
};

export default ContactUs;