import ExploreOurProduct from '../_components/explore-our-product';
import MonthOffer from '../_components/month-offer';
import React from 'react';
import { WebsiteTemplatePayload } from '@/types/website/website';
import HeroSection from '../_components/hero-section';
import CategoriesSection from '../_components/categories-section';
import PolicyLabel from '../_components/policy-label';
import PartnerSection from '../_components/brand-section';
import BestSellingProducts from '../_components/best-selling-products';
import BrandSection from '../_components/brand-section';

const ElectronicHomePage = ({ resolveData }: { resolveData: WebsiteTemplatePayload }) => {
    const bannerSlide = resolveData?.config?.headerConfig?.slide;
    const partners = resolveData?.config?.generalConfig?.partners ?? [];

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    return (
        <div>
            <HeroSection bannerSlide={bannerSlide ?? []} />

            <CategoriesSection />

            <div className="flex flex-col gap-6 lg:flex-row mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="w-full lg:w-[35%] h-full">
                    <MonthOffer monthlyOffer={monthlyOffer} />
                </div>

                <div className="w-full lg:w-[65%]">
                    <ExploreOurProduct />
                </div>
            </div>

            <BrandSection />

            <BestSellingProducts />
        </div>
    );
};

export default ElectronicHomePage;