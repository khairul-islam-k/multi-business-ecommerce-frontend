import HeroCarousel from "@/components/home/HeroCarousel";
import FeatureSection from "@/components/home/FeatureSection";
import Testimonial from "@/components/home/Testimonial";
import Pricing from "@/components/home/Pricing";
import FAQSection from "@/components/home/FAQSection";
import Analities from "@/components/home/Analities";
import BusinessSmarter from "@/components/home/BusinessSmarter";
import DemoWebsite from "@/components/home/DemoWebsite";
import CustomerComment from "@/components/home/CustomerComment";
import CustomersSays from "@/components/home/CustomersSays";

export default function HomePage() {
  return (
    <div >

      {/* hero */}
      <HeroCarousel />

      {/* analities */}
      <Analities />


      {/* business smarter */}
      <BusinessSmarter></BusinessSmarter>

      {/* Deme */}
      <DemoWebsite />

      {/* feature section */}
      <FeatureSection />

      {/* testimonial */}
      {/* <Testimonial /> */}

      <CustomersSays />

      {/* pricing */}
      <Pricing />

      {/* FaqSection */}
      <FAQSection />
    </div>
  );
}
