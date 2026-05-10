import ElectronicProductsPage from '@/app/templates/electronic/pages/products';
import React from 'react';

const Products = () => {
    const site = {
        name: "Onecomm Store",
        templateName: "electronic",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicProductsPage />
        );
    }
};

export default Products;