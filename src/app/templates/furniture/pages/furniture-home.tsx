import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
// import PolicyLabel from '../../fashion/_components/policy-label';
// import PartnerSection from '../_components/partner-section';
import HeroSection from '../_components/hero-section';
import CategoriesSection from '../_components/categories-section';
import CategoriesBigSection from '../_components/categories-big-section';
import ExploreOurProduct from '../_components/explore-our-product';
import MonthOffer from '../_components/month-offer';
import BrandSection from '../_components/brand-section';
// import BestSellingProducts from '../_components/best-selling-products';

const FurnitureHome = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];


    return (
        <div>
            <div className='px-4 lg:px-5'>
                <HeroSection bannerSlide={bannerSlide ?? []} />
            </div>
            
            <CategoriesSection />

            <CategoriesBigSection />

            <ExploreOurProduct />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <BrandSection />
        </div>
    );
};

export default FurnitureHome;