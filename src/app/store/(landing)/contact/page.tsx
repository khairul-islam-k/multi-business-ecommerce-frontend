import ElectronicContactClient from '@/app/templates/electronic/pages/contact-page';
import FashionContactPage from '@/app/templates/fashion/pages/contact-page';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

const ContactUs = async () => {

    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    console.log('res', res.data.data.config.footerConfig);

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
            <FashionContactPage footer={res.data.data.config.footerConfig} />
        );
    }
};

export default ContactUs;