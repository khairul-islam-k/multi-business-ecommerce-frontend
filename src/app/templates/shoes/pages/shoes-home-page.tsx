import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import CategoriesSection from '../_components/categories-section';
import HeroSection from '../_components/hero-section';
import ExploreOurProduct from '../_components/explore-our-product';
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
            
            {/* <CategoriesSection /> */}

            <ExploreOurProduct />

        </div>
    );
};

export default ShoesHomePage;