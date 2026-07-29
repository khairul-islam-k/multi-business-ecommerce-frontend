import React from "react";

import { WebsiteTemplatePayload } from "@/types/website/website";

import ExploreOurProduct from "../_components/explore-our-product";
import HeroSection from "../_components/hero-section";
import RestaurantSection from "../_components/restaurant-section";
import CategoriesSection from "../_components/categories-section";
import OurChef from "../_components/our-chef";

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

      {
        ourChef && 
        <OurChef ourChef={ourChef} />
      }
    </div>
  );
};

export default RestaurantHomePage;