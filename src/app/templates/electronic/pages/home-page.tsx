import ExploreOurProduct from '../_components/explore-our-product';
import MonthOffer from '../_components/month-offer';
import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import CategoriesSection from '../_components/categories-section';
import PolicyLabel from '../_components/policy-label';
import PartnerSection from '../_components/partner-section';
import BestSellingProducts from '../_components/best-selling-products';

const ElectronicHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />
            
            <CategoriesSection />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <ExploreOurProduct />

            <PolicyLabel />

            <PartnerSection partners={partners} />

            <BestSellingProducts />
        </div>
    );
};

export default ElectronicHomePage;