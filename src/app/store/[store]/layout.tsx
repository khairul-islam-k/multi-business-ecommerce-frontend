import { CartProvider } from '@/app/store/[store]/_components/contex/CartContex';
import { ElectronicFooter } from '@/app/templates/electronic/_components/footer';
import { ElectronicNavBar } from '@/app/templates/electronic/_components/navbar';
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