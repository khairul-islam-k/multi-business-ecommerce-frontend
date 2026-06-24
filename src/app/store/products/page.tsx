// import ElectronicProductsPage from "@/app/templates/electronic/pages/Products";
import ElectronicProductsPage from '@/app/templates/electronic/pages/products';
import FashionProduct from '@/app/templates/fashion/pages/fashion-product';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

type ProductsPageProps = {
    searchParams: Promise<{
        categoryId?: string;
    }>;
};

const Products = async ({ searchParams }: ProductsPageProps) => {

    const params = await searchParams;
    const categoryId = params.categoryId;

    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    const site = {
        name: "Onecomm Store",
        templateName: "fashion",
        logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
    };

    if (site.templateName === 'ELECTRONIC') {
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
