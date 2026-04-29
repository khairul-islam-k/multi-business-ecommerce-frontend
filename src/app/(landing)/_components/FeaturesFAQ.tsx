import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Do I need any technical skills to use OneComm?",
    a: "Not at all. OneComm is built for non-technical founders — every feature, from store setup to AI inbox training, is no-code and guided by step-by-step video tutorials.",
  },
  {
    q: "Can I sell on social media and my website at the same time?",
    a: "Yes. OneComm unifies your website, Facebook, Instagram, and WhatsApp into a single dashboard. Inventory, orders, and conversations stay perfectly in sync across channels.",
  },
  {
    q: "Which payment gateways and couriers are supported?",
    a: "We integrate natively with SSLCommerz, bKash, Nagad, Upay, and Stripe for payments — and Pathao, Steadfast, RedX, Paperfly, and RX Courier for fulfillment.",
  },
  {
    q: "How does the AI Business Inbox work?",
    a: "The AI is trained on your products, FAQs, and policies. It replies to customer messages instantly across Facebook, Instagram, and WhatsApp with human-like conversations — and hands off to a human when needed.",
  },
  {
    q: "Is my store and customer data secure?",
    a: "Every store gets free SSL, server-side fraud protection, fake-order detection, and runs on a highly scalable infrastructure with 0.5s average load times.",
  },
  {
    q: "Can I add team members with different roles?",
    a: "Yes. Multi-admin access lets you invite teammates with role-based permissions — perfect for separating operations, marketing, and support staff.",
  },
];

export const FeaturesFAQ = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Frequently Asked
            </span>
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Got <span className="text-gradient">questions?</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Quick answers to help you get the most out of OneComm.
          </p>
        </div>

        <div className="mt-14 max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-3"
          >
            {faqs.map((item, idx) => (
              <AccordionItem
                key={item.q}
                value={`item-${idx}`}
                className="rounded-2xl border border-border bg-card shadow-card data-[state=open]:shadow-elevated data-[state=open]:border-primary/30 transition-all overflow-hidden px-2"
              >
                <AccordionTrigger className="px-4 py-5 text-left hover:no-underline group">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="shrink-0 grid place-items-center h-8 w-8 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold tabular-nums group-data-[state=open]:gradient-primary group-data-[state=open]:text-primary-foreground transition-all">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base sm:text-lg font-bold tracking-tight leading-snug pt-1">
                      {item.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-5">
                  <div className="pl-12 text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Still have questions?{" "}
          <a
            href="#contact"
            className="font-semibold text-primary hover:underline"
          >
            Talk to our team →
          </a>
        </p>
      </div>
    </section>
  );
};
