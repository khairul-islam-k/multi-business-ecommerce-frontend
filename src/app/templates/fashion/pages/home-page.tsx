import BestSellingProducts from '../_components/best-selling-products';
import CategoriesSection from '../_components/categories-section';
import ExploreOurProduct from '../_components/explore-our-product';
import HeroSection from '../_components/hero-section';
import MonthOffer from '../_components/month-offer';
import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import BrandSection from '../_components/brand-section';

const FashionHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />
            
            <CategoriesSection />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <ExploreOurProduct />

            <BrandSection />

            <BestSellingProducts />
        </div>
    );
};

export default FashionHomePage;