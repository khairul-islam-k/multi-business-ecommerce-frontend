import HeroCarousel from "@/components/home/HeroCarousel";
import FeatureSection from "@/components/home/FeatureSection";
import Testimonial from "@/components/home/Testimonial";
import Pricing from "@/components/home/Pricing";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <div >

      {/* hero */}
      <HeroCarousel />

      {/* feature section */}
      <FeatureSection />

      {/* testimonial */}
      <Testimonial />

      {/* pricing */}
      <Pricing />

      {/* FaqSection */}
      <FAQSection />
    </div>
  );
}
