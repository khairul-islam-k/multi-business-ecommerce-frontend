import { FileText } from "lucide-react";
import React from "react";

type FashionTermConditionProps = {
  terms: string;
};

const FashionTermCondition = ({
  terms,
}: FashionTermConditionProps) => {
  const termsText = terms?.trim();

  return (
    <main className="min-h-screen bg-[var(--store-bg-1)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--store-bg-2)] py-14 sm:py-16 lg:py-20">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#f16d59]/10 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#f16d59]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
            <FileText className="h-7 w-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
            Store Policies
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Terms and Conditions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Please read these terms carefully before using our website,
            creating an account, or purchasing any fashion product.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[var(--store-bg-1)] px-5 py-2.5 text-sm text-gray-500">
            <FileText className="h-4 w-4 text-[#f16d59]" />
            Terms of website use and purchase
          </div>
        </div>
      </section>

      {/* Terms Text */}
      <section className="py-10 sm:py-12 lg:py-16">
        <article className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          {termsText ? (
            <div className="whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              {termsText}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-[var(--store-bg-2)] px-5 py-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-gray-400" />

              <h2 className="mt-4 text-lg font-semibold">
                Terms and conditions are not available
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                The terms and conditions content has not been added yet.
              </p>
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default FashionTermCondition;