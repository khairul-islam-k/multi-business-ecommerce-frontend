import { Navbar } from "./_components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ShadcnThemeProvider } from "@/providers/shadcn-theme-provider";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "./_components/Footer";

export default function MarketingDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShadcnThemeProvider>
      <TooltipProvider>
        <main className="min-h-screen bg-background">
          <h1 className="sr-only">
            OneComm — All-in-One eCommerce and Social Commerce Platform
          </h1>
          <Navbar />
          {children}
          <ScrollToTop />
          <Reveal>
            <Footer />
          </Reveal>
        </main>
      </TooltipProvider>
    </ShadcnThemeProvider>
  );
}
