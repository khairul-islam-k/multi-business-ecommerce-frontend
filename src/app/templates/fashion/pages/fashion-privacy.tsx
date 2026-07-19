import { FileText, ShieldCheck } from "lucide-react";
import React from "react";

type PrivacyProps = {
  privacy: string;
};

const FashionPrivacy = ({ privacy }: PrivacyProps) => {
  return (
    <main className="min-h-screen bg-[var(--store-bg-1)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--store-bg-1)] py-10 sm:py-10 lg:py-15">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#f16d59]/10 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#f16d59]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
            Your Privacy Matters
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Learn how we collect, use, protect, and manage your personal
            information when you shop with us.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[var(--store-bg-1)] px-5 py-2.5 text-sm text-gray-500">
            <FileText className="h-4 w-4 text-[#f16d59]" />
            Last updated: July 11, 2026
          </div>
        </div>
      </section>

      {/* Privacy Text */}
      <section className="bg-[var(--store-bg-1)]">
        <article className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-9">
          {privacy?.trim() ? (
            <div className="whitespace-pre-line break-words text-sm leading-7 sm:text-base sm:leading-8">
              {privacy}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Privacy policy is not available.
            </p>
          )}
        </article>
      </section>
    </main>
  );
};

export default FashionPrivacy;