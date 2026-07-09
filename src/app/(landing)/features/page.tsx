import { Reveal } from "@/components/ui/reveal";
import { FinalCTA } from "../_components/FinalCTA";
import { FeaturesFAQ } from "../_components/FeaturesFAQ";
import { FeaturesGrid } from "../_components/FeaturesGrid";
import { FeaturesHero } from "../_components/FeaturesHero";

const sections = [FeaturesGrid, FeaturesFAQ, FinalCTA];

export default function PricingPage() {
  return (
    <>
      <FeaturesHero />
      <div className="px-2 md:px-0">
        {sections.map((Section, i) => (
          <Reveal key={i}>
            <Section />
          </Reveal>
        ))}
      </div>
    </>
  );
}
