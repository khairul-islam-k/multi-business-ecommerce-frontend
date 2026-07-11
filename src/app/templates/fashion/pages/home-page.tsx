import BestSellingProducts from '../_components/best-selling-products';
import CategoriesSection from '../_components/categories-section';
import DealOfDay from '../_components/deal-of-day';
import ExploreOurProduct from '../_components/explore-our-product';
import HeroSection from '../_components/hero-section';
import MonthOffer from '../_components/month-offer';
import PartnerSection from '../_components/partner-section';
import PolicyLabel from '../_components/policy-label';
import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';

const FashionHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];
    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />
            
            <CategoriesSection />

            <MonthOffer />

            <ExploreOurProduct />

            <PolicyLabel />

            <DealOfDay />

            <PartnerSection partners={partners} />

            <BestSellingProducts />
        </div>
    );
};

export default FashionHomePage;