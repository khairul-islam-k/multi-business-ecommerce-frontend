// import ElectronicProductsPage from "@/app/templates/electronic/pages/Products";
import ElectronicProductsPage from '@/app/templates/electronic/pages/products';
import FashionProduct from '@/app/templates/fashion/pages/fashion-product';
import React from 'react';

type ProductsPageProps = {
    searchParams: Promise<{
        categoryId?: string;
    }>;
};

const Products = async ({ searchParams }: ProductsPageProps) => {

    const params = await searchParams;
    const categoryId = params.categoryId;

    const site = {
        name: "Onecomm Store",
        templateName: "fashion",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'electronic') {
        return (
            <ElectronicProductsPage />
        );
    }

    if (site.templateName === 'fashion') {
        return (
            <FashionProduct categoryId={categoryId} />
        );
    }
};

export default Products;
