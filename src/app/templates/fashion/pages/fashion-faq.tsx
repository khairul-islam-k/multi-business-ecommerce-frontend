"use client";

import { FAQItem } from "@/types/website/website";
import { ChevronDown, CircleHelp, HelpCircle } from "lucide-react";
import { useState } from "react";

type FAQProps = {
  faqs?: FAQItem[];
};

const FashionFAQ = ({ faqs = [] }: FAQProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setActiveIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

  return (
    <main className="min-h-screen bg-[var(--store-bg)] text-[var(--store-text)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--store-bg-2)] py-4 sm:py-10">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[var(--store-primary)]/10 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[var(--store-primary)]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
            <CircleHelp className="size-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--store-primary)]">
            Help Center
          </p>

          <h1 className="text-4xl font-bold text-[var(--store-text)] sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--store-muted)] sm:text-base">
            Find answers about our fashion products, orders, payments,
            deliveries, returns, and refunds.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-4 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeIndex === index;
                const contentId = `faq-answer-${index}`;
                const buttonId = `faq-question-${index}`;

                return (
                  <article
                    key={`${faq.question}-${index}`}
                    className={`overflow-hidden rounded-2xl border bg-[var(--store-card)] transition-all duration-300 ${
                      isOpen
                        ? "border-[var(--store-primary)] shadow-lg"
                        : "border-[var(--store-border)] hover:border-[var(--store-primary)]/50"
                    }`}
                  >
                    <h2>
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => handleToggle(index)}
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6 sm:py-6"
                      >
                        <span className="flex min-w-0 items-center gap-4">
                          <span
                            className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                              isOpen
                                ? "bg-[var(--store-primary)] text-[var(--store-primary-foreground)]"
                                : "bg-[var(--store-bg-2)] text-[var(--store-primary)]"
                            }`}
                          >
                            <HelpCircle className="size-5" />
                          </span>

                          <span className="text-base font-semibold leading-6 text-[var(--store-text)] sm:text-lg">
                            {faq.question}
                          </span>
                        </span>

                        <ChevronDown
                          className={`size-5 shrink-0 text-[var(--store-primary)] transition-transform duration-300 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    </h2>

                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-[var(--store-border)] px-5 py-5 sm:px-6">
                          <p className="pl-0 text-sm leading-7 text-[var(--store-muted)] sm:pl-14 sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-card)] px-6 py-16 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
                <CircleHelp className="size-7" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-[var(--store-text)]">
                No FAQs found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--store-muted)]">
                Frequently asked questions have not been added yet. Please
                check again later.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FashionFAQ;