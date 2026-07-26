import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import FeatureProduct from '../_components/feature-product';
import ExploreOurProduct from '../_components/explore-our-product';
import MonthOffer from '../_components/month-offer';
import BrandSection from '../_components/brand-section';
// import BestSellingProducts from '../_components/best-selling-products';

const CosmeticsHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />

            <FeatureProduct />


            <ExploreOurProduct />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <BrandSection />
        </div>
    );
};

export default CosmeticsHomePage;