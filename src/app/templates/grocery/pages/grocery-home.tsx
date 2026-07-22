import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import CategoriesSection from '../_components/categories-section';
import MonthOffer from '../_components/month-offer';
import ExploreOurProduct from '../_components/explore-our-product';
import PartnerSection from '../_components/partner-section';
// import BestSellingProducts from '../_components/best-selling-products';

const GroceryHome = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />
            
            <CategoriesSection />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <ExploreOurProduct />

            <PartnerSection />
        </div>
    );
};

export default GroceryHome;