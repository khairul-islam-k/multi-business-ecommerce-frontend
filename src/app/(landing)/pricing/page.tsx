import { Reveal } from "@/components/ui/reveal";
import { Pricing } from "../_components/Pricing";
import { FinalCTA } from "../_components/FinalCTA";
import { PricingCompare } from "../_components/PricingCompare";
import PricingCards from "../_components/pricing-cards";

const sections = [PricingCards, PricingCompare, FinalCTA];

export default function PricingPage() {
  return (
    <>
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
