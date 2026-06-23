import React from 'react';
import HeroSection from '../_components/hero-section';
import CategoriesSection from '../_components/categories-section';
import MonthOffer from '../_components/month-offer';
import ExploreOurProduct from '../_components/explore-our-product';
import DealOfDay from '../_components/deal-of-day';
import PartnerSection from '../_components/partner-section';
import BestSellingProducts from '../_components/best-selling-products';
import PolicyLabel from '../_components/policy-label';

type Props = {
    site: {
        name: string;
        logo?: string;
        templateName: string;
        store: string;
    };
};

const FashionHomePage = ({ site }: Props) => {
    return (
        <div>
            <HeroSection />
            
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