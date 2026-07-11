import Link from "next/link";
import {
  BadgeCheck,
  Ban,
  ChevronRight,
  CircleDollarSign,
  Copyright,
  FileCheck2,
  FileText,
  Gavel,
  Globe2,
  Mail,
  PackageCheck,
  RefreshCcw,
  Scale,
  ShieldAlert,
  ShoppingBag,
  Truck,
  Undo2,
  UserRoundCheck,
} from "lucide-react";
import React from "react";

const termsSections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    icon: FileCheck2,
    content: (
      <>
        <p>
          By accessing, browsing, registering an account, or purchasing
          products from our website, you agree to follow these Terms and
          Conditions.
        </p>

        <p>
          If you do not agree with any part of these terms, you should stop
          using the website and its services.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    number: "02",
    title: "Eligibility and Account Registration",
    icon: UserRoundCheck,
    content: (
      <>
        <p>
          You must provide accurate, complete, and current information when
          creating an account or placing an order.
        </p>

        <ul>
          <li>You are responsible for keeping your password confidential.</li>
          <li>
            You are responsible for all activity performed through your
            account.
          </li>
          <li>
            You must notify us immediately if you suspect unauthorized account
            access.
          </li>
          <li>
            We may suspend or close accounts containing false, misleading, or
            fraudulent information.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "products",
    number: "03",
    title: "Products and Availability",
    icon: ShoppingBag,
    content: (
      <>
        <p>
          We try to ensure that product descriptions, images, prices, sizes,
          colors, materials, and availability are accurate.
        </p>

        <p>
          However, actual product colors may vary slightly because of lighting,
          photography, device display settings, or production differences.
        </p>

        <ul>
          <li>All products are subject to availability.</li>
          <li>We may limit the quantity of any product.</li>
          <li>
            We may update, discontinue, or replace products without prior
            notice.
          </li>
          <li>
            A product displayed on the website is not guaranteed to remain in
            stock.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "orders",
    number: "04",
    title: "Orders and Order Confirmation",
    icon: PackageCheck,
    content: (
      <>
        <p>
          Placing an order does not automatically mean that your order has been
          accepted.
        </p>

        <p>
          An order is considered accepted after it has been reviewed and
          confirmed by our team. We may contact you by phone, email, or SMS to
          verify order details.
        </p>

        <p>We reserve the right to cancel or reject an order because of:</p>

        <ul>
          <li>Product unavailability.</li>
          <li>Incorrect pricing or product information.</li>
          <li>Payment failure or suspected fraudulent activity.</li>
          <li>Incomplete or incorrect shipping information.</li>
          <li>Courier or delivery restrictions.</li>
        </ul>
      </>
    ),
  },
  {
    id: "pricing",
    number: "05",
    title: "Pricing, Discounts and Promotions",
    icon: CircleDollarSign,
    content: (
      <>
        <p>
          Product prices are displayed in the currency shown on the website.
          Delivery charges, taxes, or other applicable fees may be added during
          checkout.
        </p>

        <ul>
          <li>Prices may change without prior notice.</li>
          <li>
            Discount codes cannot be exchanged for cash unless clearly stated.
          </li>
          <li>
            Promotions may have specific dates, limits, or eligibility
            conditions.
          </li>
          <li>
            We may cancel orders affected by an obvious pricing or technical
            error.
          </li>
          <li>
            Multiple offers may not be combined unless expressly permitted.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    number: "06",
    title: "Payments",
    icon: BadgeCheck,
    content: (
      <>
        <p>
          Available payment methods may include cash on delivery, mobile
          banking, debit or credit cards, bank payments, and supported online
          payment gateways.
        </p>

        <p>
          You agree to provide valid payment information and confirm that you
          are authorized to use the selected payment method.
        </p>

        <p>
          Online payments may be processed by third-party payment providers.
          Their own terms, fees, verification requirements, and privacy policies
          may apply.
        </p>
      </>
    ),
  },
  {
    id: "shipping",
    number: "07",
    title: "Shipping and Delivery",
    icon: Truck,
    content: (
      <>
        <p>
          Estimated delivery times are provided for convenience and are not
          guaranteed delivery dates.
        </p>

        <ul>
          <li>
            Delivery time may vary depending on location, courier service,
            weather, public holidays, or operational conditions.
          </li>
          <li>
            You must provide a complete and accurate delivery address and phone
            number.
          </li>
          <li>
            Additional charges may apply when an order must be delivered again
            because of an incorrect address or unavailable recipient.
          </li>
          <li>
            Risk of loss may pass to the customer after successful delivery.
          </li>
        </ul>

        <p>
          We are not responsible for delays caused by events outside our
          reasonable control.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    number: "08",
    title: "Returns, Exchanges and Refunds",
    icon: Undo2,
    content: (
      <>
        <p>
          Returns and exchanges are accepted only according to our return
          policy and the eligibility conditions applicable to the purchased
          product.
        </p>

        <p>Unless otherwise stated, returned products must be:</p>

        <ul>
          <li>Unused, unwashed, and undamaged.</li>
          <li>Returned with original tags, accessories, and packaging.</li>
          <li>Accompanied by valid order or purchase information.</li>
          <li>Returned within the stated return period.</li>
        </ul>

        <p>
          Certain products may not be eligible for return because of hygiene,
          customization, clearance status, or other product-specific reasons.
        </p>

        <p>
          Refunds are processed after the returned item has been received and
          inspected.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    number: "09",
    title: "Order Cancellation",
    icon: Ban,
    content: (
      <>
        <p>
          You may request an order cancellation before the order has been
          processed or shipped.
        </p>

        <p>
          Once an order has been shipped, cancellation may no longer be
          available. In that case, the return or exchange policy may apply
          after delivery.
        </p>

        <p>
          We may cancel an order because of stock issues, failed verification,
          payment problems, suspected fraud, technical errors, or delivery
          limitations.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    number: "10",
    title: "Acceptable Use",
    icon: ShieldAlert,
    content: (
      <>
        <p>
          You agree to use our website only for lawful shopping and
          communication purposes.
        </p>

        <p>You must not:</p>

        <ul>
          <li>Use the website for fraudulent or unlawful activities.</li>
          <li>Attempt to access another customer&apos;s account.</li>
          <li>Upload malicious software, scripts, or harmful content.</li>
          <li>Interfere with website security, servers, or functionality.</li>
          <li>Copy or scrape website content without authorization.</li>
          <li>Submit false reviews, orders, claims, or payment information.</li>
          <li>
            Use automated systems to purchase products unfairly or disrupt the
            service.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    number: "11",
    title: "Intellectual Property",
    icon: Copyright,
    content: (
      <>
        <p>
          All website content, including the logo, product images, graphics,
          text, designs, page layouts, icons, videos, and software, belongs to
          us or our licensed content providers.
        </p>

        <p>
          You may not reproduce, distribute, modify, publish, sell, or
          commercially use this content without prior written permission.
        </p>

        <p>
          You may use the website content only for personal and non-commercial
          shopping purposes.
        </p>
      </>
    ),
  },
  {
    id: "reviews",
    number: "12",
    title: "Reviews and User Content",
    icon: Globe2,
    content: (
      <>
        <p>
          When you submit reviews, comments, images, feedback, or other content,
          you confirm that the content is accurate and does not violate another
          person&apos;s rights.
        </p>

        <p>You must not submit content that is:</p>

        <ul>
          <li>False, defamatory, abusive, threatening, or discriminatory.</li>
          <li>Obscene, unlawful, or intentionally misleading.</li>
          <li>Copied from another person without permission.</li>
          <li>Promotional spam or unrelated to the product or service.</li>
        </ul>

        <p>
          We may review, remove, or refuse user content that violates these
          terms.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    number: "13",
    title: "Limitation of Liability",
    icon: Scale,
    content: (
      <>
        <p>
          We try to provide a reliable website and accurate service, but we do
          not guarantee that the website will always be uninterrupted,
          error-free, or completely secure.
        </p>

        <p>
          To the extent permitted by applicable law, we will not be responsible
          for indirect, incidental, special, or consequential loss resulting
          from:
        </p>

        <ul>
          <li>Website interruption or technical issues.</li>
          <li>Unauthorized account access caused by customer negligence.</li>
          <li>Third-party payment or courier service failures.</li>
          <li>Incorrect use, care, or handling of purchased products.</li>
          <li>Events beyond our reasonable control.</li>
        </ul>
      </>
    ),
  },
  {
    id: "indemnification",
    number: "14",
    title: "Indemnification",
    icon: Gavel,
    content: (
      <>
        <p>
          You agree to be responsible for losses, claims, or expenses resulting
          from your misuse of the website, violation of these terms, fraudulent
          activity, or infringement of another person&apos;s rights.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    number: "15",
    title: "Governing Law and Disputes",
    icon: Scale,
    content: (
      <>
        <p>
          These Terms and Conditions are governed by the applicable laws of
          Bangladesh.
        </p>

        <p>
          We encourage customers to contact our support team first so that any
          complaint or dispute can be resolved fairly and promptly.
        </p>

        <p>
          Any unresolved legal dispute will be handled by the courts or
          competent authorities having jurisdiction under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "16",
    title: "Changes to These Terms",
    icon: RefreshCcw,
    content: (
      <>
        <p>
          We may update these Terms and Conditions to reflect changes in our
          services, business practices, legal obligations, or website features.
        </p>

        <p>
          Updated terms will be published on this page with a revised effective
          date. Continuing to use the website after an update means that you
          accept the revised terms.
        </p>
      </>
    ),
  },
];

const FashionTermCondition = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--store-bg-2)] py-16 sm:py-20">
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
            Effective date: July 11, 2026
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Navigation Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f16d59]">
                  On This Page
                </p>

                <h2 className="mt-2 text-xl font-bold">Terms Sections</h2>

                <nav className="mt-5 max-h-[560px] space-y-1.5 overflow-y-auto pr-1">
                  {termsSections.map((section) => (
                    <Link
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-[#f16d59]/10 hover:text-[#f16d59]"
                    >
                      <span>{section.title}</span>

                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-6 rounded-3xl bg-gray-950 p-6 text-white">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-[#f16d59]">
                  <Mail className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Have a Question?
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Contact our support team if you have questions about an order,
                  payment, delivery, or these terms.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#f16d59] px-5 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-950"
                >
                  Contact Support
                </Link>
              </div>
            </aside>

            {/* Main Content */}
            <div className="min-w-0">
              {/* Introduction */}
              <div className="mb-6 rounded-3xl border border-[#f16d59]/20 bg-[#f16d59]/5 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f16d59] text-white">
                    <FileCheck2 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Agreement Between You and Our Store
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      These Terms and Conditions govern your use of the Fashion
                      Store website, customer account, ordering system, payment
                      facilities, delivery services, and related features.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      By using our services, you confirm that you have read,
                      understood, and agreed to these terms together with our
                      privacy, shipping, return, and refund policies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="space-y-6">
                {termsSections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <article
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-24 rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-6 transition-all duration-300 hover:border-[#f16d59]/50 hover:shadow-lg sm:p-8"
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f16d59]">
                            Section {section.number}
                          </span>

                          <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                            {section.title}
                          </h2>

                          <div className="mt-5 space-y-4 text-sm leading-7 text-gray-500 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc [&_li::marker]:text-[#f16d59]">
                            {section.content}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Force Majeure */}
              <div className="mt-6 rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                    <ShieldAlert className="h-5 w-5" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f16d59]">
                      Additional Provision
                    </span>

                    <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                      Events Beyond Our Control
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-gray-500">
                      We will not be responsible for delays or failure to
                      perform obligations caused by events beyond our reasonable
                      control, including natural disasters, extreme weather,
                      strikes, transportation disruptions, public emergencies,
                      government restrictions, internet outages, or courier
                      service interruptions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Severability */}
              <div className="mt-6 rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                    <Gavel className="h-5 w-5" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f16d59]">
                      Legal Provision
                    </span>

                    <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                      Severability and Entire Agreement
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-gray-500">
                      If any provision of these terms is found to be invalid or
                      unenforceable, the remaining provisions will continue to
                      apply.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      These terms, together with the policies referenced on our
                      website, form the complete agreement regarding your use of
                      our online store.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-6 overflow-hidden rounded-3xl bg-gray-950 p-7 text-white sm:p-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f16d59]">
                      Contact Information
                    </p>

                    <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                      Questions About These Terms?
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
                      Contact our customer support team if you need additional
                      information regarding these Terms and Conditions.
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="font-semibold text-white">Email:</span>{" "}
                        support@fashionstore.com
                      </p>

                      <p>
                        <span className="font-semibold text-white">Phone:</span>{" "}
                        +880 1234 567 890
                      </p>

                      <p>
                        <span className="font-semibold text-white">
                          Address:
                        </span>{" "}
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#f16d59] px-7 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-950"
                  >
                    Send a Message
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Notice */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-[var(--store-bg-2)] px-6 py-8 text-center sm:px-10">
            <Scale className="mx-auto h-9 w-9 text-[#f16d59]" />

            <h2 className="mt-4 text-2xl font-bold">
              Shop With Confidence
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              These terms are designed to create a transparent, secure, and
              reliable shopping experience for every customer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FashionTermCondition;