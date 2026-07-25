import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import FilterSection from '../_components/filter-section';
import ExploreProduct from '../_components/explore-product';
import MonthOffer from '../_components/month-offer';
import CategoriesSection from '../_components/categories-section';
// import BestSellingProducts from '../_components/best-selling-products';

const VehicleHome = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];


    return (
        <div>

                <div className='relative'>
                    <HeroSection bannerSlide={bannerSlide ?? []} />
                </div>

                <FilterSection />

            <ExploreProduct />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <CategoriesSection />

        </div>
    );
};

export default VehicleHome;