import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import BrandSection from '../_components/brand-section';
import ExploreOurProduct from '../_components/explore-our-product';
import MonthOffer from '../_components/month-offer';
import CategoriesSection from '../_components/categories-section';

const ToyHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />

            <BrandSection />

            <ExploreOurProduct />
            
            

            <MonthOffer monthlyOffer={monthlyOffer} />

            <CategoriesSection />
        </div>
    );
};

export default ToyHomePage;