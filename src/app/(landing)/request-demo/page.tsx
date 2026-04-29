import { Reveal } from "@/components/ui/reveal";
import {
  RequestDemoHero,
  RequestDemoSection,
} from "../_components/RequestDemo";

const sections = [RequestDemoSection];

export default function RequestDemoPage() {
  return (
    <>
      <RequestDemoHero />
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
