import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Cookie,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  UserRoundCheck,
} from "lucide-react";
import React from "react";

const privacySections = [
  {
    id: "information-we-collect",
    number: "01",
    title: "Information We Collect",
    icon: Database,
    content: (
      <>
        <p>
          We may collect personal information that you provide when you create
          an account, place an order, contact customer support, subscribe to our
          newsletter, or interact with our website.
        </p>

        <p>The information we collect may include:</p>

        <ul>
          <li>Your name, email address, phone number and account details.</li>
          <li>Billing address, shipping address and delivery instructions.</li>
          <li>
            Order details, purchased products, transaction history and return
            information.
          </li>
          <li>
            Device information, IP address, browser type and website activity.
          </li>
          <li>
            Messages, reviews, feedback and other information you send to us.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    number: "02",
    title: "How We Use Your Information",
    icon: UserRoundCheck,
    content: (
      <>
        <p>
          We use your personal information to provide, manage and improve our
          fashion store services.
        </p>

        <p>Your information may be used to:</p>

        <ul>
          <li>Create and manage your customer account.</li>
          <li>Process, confirm, deliver and track your orders.</li>
          <li>Process payments, returns, exchanges and refunds.</li>
          <li>Send order updates and important account notifications.</li>
          <li>Respond to customer service requests and inquiries.</li>
          <li>Improve our products, services and shopping experience.</li>
          <li>
            Send promotional messages when you have agreed to receive them.
          </li>
          <li>Prevent fraud, misuse and unauthorized transactions.</li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    number: "03",
    title: "Payment Information",
    icon: LockKeyhole,
    content: (
      <>
        <p>
          Payments may be processed through third-party payment gateways,
          banks, mobile banking providers or card processors.
        </p>

        <p>
          We do not directly store your complete card number, PIN, mobile
          banking password or other sensitive payment credentials. Payment
          providers process this information according to their own privacy and
          security policies.
        </p>
      </>
    ),
  },
  {
    id: "sharing-information",
    number: "04",
    title: "How We Share Information",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          We do not sell or rent your personal information. We may share
          necessary information with trusted service providers when required to
          operate our store.
        </p>

        <p>Information may be shared with:</p>

        <ul>
          <li>Courier and delivery service providers.</li>
          <li>Payment gateways, banks and payment processors.</li>
          <li>Website hosting, analytics and technology service providers.</li>
          <li>Customer support and communication service providers.</li>
          <li>
            Government or legal authorities when disclosure is required by law.
          </li>
        </ul>

        <p>
          These service providers receive only the information required to
          perform their specific services.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    number: "05",
    title: "Cookies and Tracking Technologies",
    icon: Cookie,
    content: (
      <>
        <p>
          Our website may use cookies and similar technologies to remember your
          preferences, maintain your shopping cart, keep you signed in and
          understand how visitors use our website.
        </p>

        <p>
          You can control or disable cookies from your browser settings.
          However, disabling essential cookies may prevent some website
          features from working correctly.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    number: "06",
    title: "Data Security",
    icon: LockKeyhole,
    content: (
      <>
        <p>
          We use reasonable administrative, technical and organizational
          security measures to protect your information against unauthorized
          access, loss, misuse, alteration or disclosure.
        </p>

        <p>
          Although we take appropriate precautions, no internet transmission or
          electronic storage system can be guaranteed to be completely secure.
          You are responsible for keeping your account password confidential.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    number: "07",
    title: "Data Retention",
    icon: Database,
    content: (
      <>
        <p>
          We retain personal information only for as long as necessary to
          provide our services, complete transactions, maintain business
          records, resolve disputes and meet legal or regulatory requirements.
        </p>

        <p>
          Some order, transaction and payment records may need to be retained
          after your account has been closed.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    number: "08",
    title: "Your Privacy Rights",
    icon: UserRoundCheck,
    content: (
      <>
        <p>
          Depending on applicable law, you may have the right to request access
          to, correction of or deletion of your personal information.
        </p>

        <p>You may also request to:</p>

        <ul>
          <li>Update inaccurate or incomplete account information.</li>
          <li>Unsubscribe from promotional email or SMS messages.</li>
          <li>Close your customer account.</li>
          <li>Request information about how your data is used.</li>
          <li>Withdraw consent where processing is based on consent.</li>
        </ul>

        <p>
          Certain information may be retained when required for legal,
          accounting, fraud prevention or transaction record purposes.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    number: "09",
    title: "Third-Party Links",
    icon: ShoppingBag,
    content: (
      <>
        <p>
          Our website may contain links to third-party websites or services. We
          are not responsible for the privacy practices, security or content of
          those external websites.
        </p>

        <p>
          We recommend reviewing the privacy policy of any third-party service
          before providing personal information.
        </p>
      </>
    ),
  },
  {
    id: "policy-updates",
    number: "10",
    title: "Changes to This Policy",
    icon: RefreshCcw,
    content: (
      <>
        <p>
          We may update this privacy policy when our services, legal
          requirements or business practices change.
        </p>

        <p>
          Any updated version will be published on this page with a revised
          effective date. We encourage you to review this policy periodically.
        </p>
      </>
    ),
  },
];

const FashionPrivacy = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--store-bg-2)] py-16 sm:py-20">
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
            Learn how we collect, use, protect and manage your personal
            information when you shop with us.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[var(--store-bg-1)] px-5 py-2.5 text-sm text-gray-500">
            <FileText className="h-4 w-4 text-[#f16d59]" />
            Last updated: July 11, 2026
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f16d59]">
                  On This Page
                </p>

                <h2 className="mt-2 text-xl font-bold">Policy Sections</h2>

                <nav className="mt-5 space-y-1.5">
                  {privacySections.map((section) => (
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
                  Privacy Questions?
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Contact our support team if you have questions about your
                  information or this policy.
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
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Introduction
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      This privacy policy explains how Fashion Store collects,
                      uses, shares and protects information when you visit our
                      website, create an account, purchase products or
                      communicate with us.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      By using our website and services, you acknowledge the
                      practices described in this policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-6">
                {privacySections.map((section) => {
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

                          <div className="privacy-content mt-5 space-y-4 text-sm leading-7 text-gray-500 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc [&_li::marker]:text-[#f16d59]">
                            {section.content}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Communication Preferences */}
              <div className="mt-6 rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                    <Bell className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">
                      Marketing Communications
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-gray-500">
                      When you subscribe to our newsletter or promotional
                      messages, we may send information about new collections,
                      offers, discounts and store updates.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      You can unsubscribe at any time using the unsubscribe link
                      included in an email or by contacting our support team.
                      You may still receive essential order and account
                      communications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 overflow-hidden rounded-3xl bg-gray-950 p-7 text-white sm:p-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f16d59]">
                      Contact Information
                    </p>

                    <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                      Contact Us About Your Privacy
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
                      For questions, requests or concerns regarding this privacy
                      policy or your personal information, contact our support
                      team.
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
            <ShieldCheck className="mx-auto h-9 w-9 text-[#f16d59]" />

            <h2 className="mt-4 text-2xl font-bold">
              Your Trust Is Important to Us
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              We are committed to handling your personal information
              responsibly and transparently while providing a safe shopping
              experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FashionPrivacy;