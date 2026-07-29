import React from "react";

import { WebsiteTemplatePayload } from "@/types/website/website";

import ExploreOurProduct from "../_components/explore-our-product";
import HeroSection from "../_components/hero-section";
import RestaurantSection from "../_components/restaurant-section";
import CategoriesSection from "../_components/categories-section";
import OurChef from "../_components/our-chef";
import MonthOffer from "../_components/month-offer";

type RestaurantHomePageProps = {
  resolveData: WebsiteTemplatePayload;
};

const RestaurantHomePage = ({
  resolveData,
}: RestaurantHomePageProps) => {
  const bannerSlide =
    resolveData?.config?.headerConfig?.slide ?? [];

  const restaurantData =
    resolveData?.config?.generalConfig?.restaurantSection;

    const monthlyOffer = resolveData?.config?.generalConfig?.bestOfferImages ?? [];

    const ourChef = resolveData?.config?.generalConfig?.ourChef;

  return (
    <div>
      <HeroSection bannerSlide={bannerSlide} />

      <ExploreOurProduct />

      {restaurantData && (
        <RestaurantSection
          restaurantData={restaurantData}
        />
      )}

      <CategoriesSection />

      <MonthOffer monthlyOffer={monthlyOffer} />

      {
        ourChef && 
        <OurChef ourChef={ourChef} />
      }
    </div>
  );
};

export default RestaurantHomePage;