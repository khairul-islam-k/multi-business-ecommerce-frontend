import CosmeticsProductPage from '@/app/templates/cosmetics/pages/cosmetics-product-page';
import ElectronicProduct from '@/app/templates/electronic/pages/electronic-product';
import FashionProduct from '@/app/templates/fashion/pages/fashion-product';
import FurnitureProductPage from '@/app/templates/furniture/pages/furniture-product-page';
import GroceryProduct from '@/app/templates/grocery/pages/grocery-product';
import PharmacyProductPage from '@/app/templates/pharmacy/pages/pharmacy-product-page';
import RestaurantProductPage from '@/app/templates/restaurant/pages/restaurant-product-page';
import ShoesProductPage from '@/app/templates/shoes/pages/shoes-product-page';
import ToyProductPage from '@/app/templates/toy/pages/toy-product-page';
import VehicleProductPage from '@/app/templates/vehicle/pages/vehicle-product-page';
import { publicApi } from '@/lib/axios';
import { headers } from 'next/headers';
import React from 'react';

type ProductsPageProps = {
    searchParams: Promise<{
        categoryId?: string;
        search?: string;
        brandId?: string;
    }>;
};

const Products = async ({ searchParams }: ProductsPageProps) => {

    const params = await searchParams;
    const { categoryId, search, brandId } = params;

    const header = await headers()

    const res = await publicApi.get('/storefront/resolve', {
        headers: {
            host: header.get('host') || ""
        }
    })

    const theme = res.data.data.theme
    const dashboardColor = res.data.data.config.generalConfig.dashboardColors;
    const restaurantSlide = res.data.data.config.headerConfig.slide[0];

    if (res?.data?.data?.template === "ELECTRONIC") {
        return (
            <ElectronicProduct
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "FASHION") {
        return (
            <FashionProduct
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "GROCERY") {
        return (
            <GroceryProduct
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "FURNITURE") {
        return (
            <FurnitureProductPage
                search={search}
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "PHARMACY") {
        return (
            <PharmacyProductPage
                search={search}
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "VEHICLE") {
        return (
            <VehicleProductPage
                search={search}
                brandId={brandId}
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "COSMETICS") {
        return (
            <CosmeticsProductPage
                search={search}
                brandId={brandId}
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "SHOES") {
        return (
            <ShoesProductPage
                search={search}
                brandId={brandId}
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "TOY") {
        return (
            <ToyProductPage
                search={search}
                brandId={brandId}
                theme={theme}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }

    if (res?.data?.data?.template === "RESTAURANT") {
        return (
            <RestaurantProductPage
                search={search}
                brandId={brandId}
                theme={theme}
                restaurantSlide={restaurantSlide}
                dashboardColor={dashboardColor}
                categoryId={categoryId} />
        );
    }
};

export default Products;
