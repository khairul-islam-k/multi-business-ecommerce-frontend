"use client";

import { useState } from "react";

import HeroSection from "./_components/hero";
import { AppointmentModal } from "./_components/appointment-modal";
import StepsSection from "./_components/steps";
import FeaturesSection from "./_components/features";
import CTA from "./_components/cta";
import Testimonials from "./_components/testimonials";
import BusinessSmarter from "./_components/business-smarter";
import FAQSection from "./_components/faq";
import Pricing from "./_components/pricing";
import AnimatedProduct from "./_components/AnimatedProduct";
import IndustrySolutions from "./_components/industries";
import ProductGrid from "./_components/product-grid";
import WhyUs from "./_components/why-us";
import BlazingFast from "./_components/BlazingFast";
import TrustOwner from "./_components/TrustOwner";

export default function Homepage() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <div>
      <HeroSection onBookAppointment={() => setAppointmentOpen(true)} />
      <FeaturesSection />
      {/* animated product */}
      <AnimatedProduct />

      <TrustOwner />

      <IndustrySolutions />
      <Pricing />
      <CTA />
      <WhyUs />
      <BusinessSmarter />
      <Testimonials />
      <StepsSection />

      {/* Blazing */}
      <BlazingFast />

      <ProductGrid />
      <FAQSection />
      <AppointmentModal
        open={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
      />
    </div>
  );
}
