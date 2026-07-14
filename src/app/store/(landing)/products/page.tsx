import ElectronicProduct from '@/app/templates/electronic/pages/electronic-product';
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

    if (res?.data?.data?.template === "ELECTRONIC") {
        return (
            <ElectronicProduct categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "FASHION") {
        return (
            <FashionProduct categoryId={categoryId} />
        );
    }
};

export default Products;
