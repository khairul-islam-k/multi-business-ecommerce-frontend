import React from 'react';
import HeroSection from '../_components/hero-section';
import CategoriesSection from '../_components/categories-section';
import MonthOffer from '../_components/month-offer';
import ExploreOurProduct from '../_components/explore-our-product';
import DealOfDay from '../_components/deal-of-day';
import PartnerSection from '../_components/partner-section';
import BestSellingProducts from '../_components/best-selling-products';
import PolicyLabel from '../_components/policy-label';
import { WebsiteTemplatePayload } from '@/types/website/website';

const FashionHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    console.log('resolvle', resolveData);
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    console.log('slide', bannerSlide);

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />
            
            <CategoriesSection />

            <MonthOffer />

            <ExploreOurProduct />

            <PolicyLabel />

            <DealOfDay />

            <PartnerSection />

            <BestSellingProducts />
        </div>
    );
};

export default FashionHomePage;