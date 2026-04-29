import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const cols = [
  { title: "General", links: ["Home", "Pricing", "Features", "About Us"] },
  {
    title: "Company",
    links: [
      "Contact Us",
      "Terms & Conditions",
      "Privacy Policy",
      "Return & Refund Policy",
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="mx-auto relative pt-10 pb-10 bg-gradient-to-b from-background via-accent/30 to-accent/60">
      {/* Final CTA headline */}
      <div className="container mx-auto text-center pb-12">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Take your business online,{" "}
          <span className="text-gradient">effortlessly with OneComm.</span>
        </h2>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* White footer card */}
        <div className="rounded-2xl sm:rounded-3xl bg-card shadow-elevated border border-border/60 p-6 sm:p-8 md:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="/" className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground font-display font-extrabold text-lg shadow-soft">
                  O
                </div>
                <span className="font-display text-2xl font-bold tracking-tight">
                  One
                  <span className="text-muted-foreground font-medium">
                    Comm
                  </span>
                </span>
              </a>
              <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Streamlines customer management, enhances team collaboration in
                one intuitive platform for your sales process.
              </p>
            </div>

            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-display text-lg font-bold">{c.title}</h4>
                <ul className="mt-5 space-y-3.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Partner Program */}
            <div>
              <h4 className="font-display text-lg font-bold">
                Partner Program
              </h4>
              <p className="mt-5 text-sm text-muted-foreground">
                Earn up to 15% recurring commission
              </p>
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
              >
                Become A Partner <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Address + Social card */}
          <div className="mt-10 rounded-2xl bg-accent/50 p-6 sm:p-9 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="font-display text-lg font-bold">Address</h4>
              <ul className="mt-5 space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-card text-primary shrink-0">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  +880 1969 909069
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-card text-primary shrink-0">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  hello@onecomm.io
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-card text-primary shrink-0 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  Baridhara DOHS, Dhaka 1213, Bangladesh
                </li>
              </ul>
            </div>

            <div className="sm:text-right">
              <h4 className="font-display text-lg font-bold">Follow Us</h4>
              <div className="mt-5 flex flex-wrap sm:justify-end items-center gap-2.5">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Youtube, label: "YouTube" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Linkedin, label: "LinkedIn" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-xl bg-card text-foreground/70 hover:text-primary-foreground hover:gradient-primary hover:scale-105 shadow-card transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="mt-6 sm:flex sm:justify-end">
                <Button
                  variant="hero"
                  size="sm"
                  className="rounded-full w-full sm:w-auto"
                >
                  Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} OneComm. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
