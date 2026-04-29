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
      {sections.map((Section, i) => (
        <Reveal key={i}>
          <Section />
        </Reveal>
      ))}
    </>
  );
}
