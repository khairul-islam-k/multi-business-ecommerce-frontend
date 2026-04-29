import { Reveal } from "@/components/ui/reveal";
import { Pricing } from "../_components/Pricing";
import { FinalCTA } from "../_components/FinalCTA";
import { PricingCompare } from "../_components/PricingCompare";

const sections = [Pricing, PricingCompare, FinalCTA];

export default function PricingPage() {
  return (
    <>
      {sections.map((Section, i) => (
        <Reveal key={i}>
          <Section />
        </Reveal>
      ))}
    </>
  );
}
