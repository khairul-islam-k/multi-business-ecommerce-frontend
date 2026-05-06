import { CartProvider } from '@/app/templates/electronic/components/contex/CartContex';
import { ElectronicFooter } from '@/app/templates/electronic/components/Footer';
import { ElectronicNavBar } from '@/app/templates/electronic/components/Navbar';
import React from 'react';

const WebsiteLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const site = {
        name: "Onecomm Store",
        templateName: "electronic",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    return (
        <div>
            <CartProvider>
                <ElectronicNavBar site={site} />
                {children}
                <ElectronicFooter />
            </CartProvider>
        </div>
    );
};

export default WebsiteLayout;