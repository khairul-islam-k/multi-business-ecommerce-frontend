import {
  AboutHero,
  AboutStory,
  AboutValues,
  AboutTeam,
  AboutTrust,
  AboutTimeline,
} from "../_components/About";
import { Reveal } from "@/components/ui/reveal";
import { FinalCTA } from "../_components/FinalCTA";

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
      {sections.map((Section, i) => (
        <Reveal key={i}>
          <Section />
        </Reveal>
      ))}
    </>
  );
}
