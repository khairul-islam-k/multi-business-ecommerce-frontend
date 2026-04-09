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

export default function Homepage() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <div>
      <HeroSection onBookAppointment={() => setAppointmentOpen(true)} />
      <FeaturesSection />
      <Pricing />
      <CTA />
      <BusinessSmarter />
      <Testimonials />
      <StepsSection />
      <FAQSection />
      <AppointmentModal
        open={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
      />
    </div>
  );
}
