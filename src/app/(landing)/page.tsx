import { Reveal } from "@/components/ui/reveal";
import { Hero } from "./_components/Hero";
import { SocialProof } from "./_components/SocialProof";
import { Features } from "./_components/Features";
import { AIInbox } from "./_components/AIInbox";
import { HowItWorks } from "./_components/HowItWorks";
import { Marketing } from "./_components/Marketing";
import { Partners } from "./_components/Partners";
import { Analytics } from "./_components/Analytics";
import { Testimonials } from "./_components/Testimonials";
import { FAQ } from "./_components/FAQ";
import PricingCards from "./_components/pricing-cards";

const sections = [
  SocialProof,
  Features,
  AIInbox,
  HowItWorks,
  Marketing,
  Partners,
  Analytics,
  PricingCards,
  Testimonials,
  FAQ,
];

export default function LandingPage() {
  return (
    <>
      <Hero />
      <div className="px-2 md:px-0">
        {sections.map((Section, i) => (
          <Reveal key={i} variant="rise-bounce" duration={900}>
            <Section />
          </Reveal>
        ))}
      </div>
    </>
  );
}
