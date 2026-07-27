import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import ExploreOurProduct from '../_components/explore-our-product';
import CategoriesSection from '../_components/category-section';
import BrandSection from '../_components/brand-section';
import MonthOffer from '../_components/month-offer';
// import BestSellingProducts from '../_components/best-selling-products';

const ShoesHomePage = ({resolveData}: {resolveData: WebsiteTemplatePayload}) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];


    return (
        <div className='mx-auto lg:w-[1100px] 2xl:w-[1300px]'>
            <div className='px-4 lg:px-5'>
                <HeroSection bannerSlide={bannerSlide ?? []} />
            </div>

            <ExploreOurProduct />

            <CategoriesSection />

            <MonthOffer monthlyOffer={monthlyOffer} />

            <BrandSection />

        </div>
    );
};

export default ShoesHomePage;