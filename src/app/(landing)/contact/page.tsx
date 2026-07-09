import { Reveal } from "@/components/ui/reveal";
import { ContactSection } from "../_components/ContactSection";

export default function ContactPage() {
  return (
    <>
      <div className="px-2 md:px-0">
        <Reveal>
          <ContactSection />
        </Reveal>
      </div>
    </>
  );
}
