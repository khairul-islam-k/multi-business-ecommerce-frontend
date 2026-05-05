import { Reveal } from "@/components/ui/reveal";
import { FinalCTA } from "../_components/FinalCTA";
import {
  AboutHero,
  AboutStory,
  AboutValues,
  AboutTeam,
  AboutTrust,
  AboutTimeline,
} from "../_components/About";

const sections = [
  AboutStory,
  AboutValues,
  AboutTimeline,
  AboutTrust,
  AboutTeam,
  FinalCTA,
];

export default function AboutPage() {
  return (
    <>
      <AboutHero />
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
