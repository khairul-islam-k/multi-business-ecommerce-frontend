import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

import Logo from "@/components/shared/logo";
import type {
  FooterConfig,
  GeneralConfig,
} from "@/types/website/website";
import LogoComponent from "../../fashion/_components/logo/logo-component";

type FooterProps = {
  footer: FooterConfig;
  generalConfig: GeneralConfig;
};

const FurnitureFooter = ({
  footer,
  generalConfig,
}: FooterProps) => {
  const hasAboutPage = Boolean(
    generalConfig?.extraPage?.about?.trim(),
  );

  const hasTermsPage = Boolean(
    generalConfig?.extraPage?.termsAndConditions?.trim(),
  );

  const hasFaqPage =
    Array.isArray(generalConfig?.faqs) &&
    generalConfig.faqs.length > 0;

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        {
          label: "Home",
          href: "/store",
        },

        ...(hasAboutPage
          ? [
              {
                label: "About Us",
                href: "/store/about",
              },
            ]
          : []),

        {
          label: "Contact Us",
          href: "/store/contact",
        },
      ],
    },

    {
      title: "Customer Service",
      links: [
        {
          label: "Wishlist",
          href: "/store/dashboard/wishlist",
        },
        {
          label: "Shopping Cart",
          href: "/store/dashboard/active-cart",
        },
        {
          label: "Order Tracking",
          href: "/store/dashboard/order-history",
        },
      ],
    },

    {
      title: "Information",
      links: [
        ...(hasTermsPage
          ? [
              {
                label: "Terms & Conditions",
                href: "/store/term-condition",
              },
            ]
          : []),

        ...(hasFaqPage
          ? [
              {
                label: "Frequently Asked Questions",
                href: "/store/faq",
              },
            ]
          : []),
      ],
    },
  ].filter((section) => section.links.length > 0);

  const socialLinks = [
    {
      label: "Facebook",
      href: footer?.socialLinks?.facebook,
      icon: Facebook,
    },
    {
      label: "Instagram",
      href: footer?.socialLinks?.instagram,
      icon: Instagram,
    },
    {
      label: "Twitter",
      href: footer?.socialLinks?.twitter,
      icon: Twitter,
    },
    {
      label: "YouTube",
      href: footer?.socialLinks?.youtube,
      icon: Youtube,
    },
  ];

  const hasContactInformation = Boolean(
    footer?.address?.trim() ||
      footer?.phone?.trim() ||
      footer?.email?.trim(),
  );

  return (
    <footer className="overflow-hidden bg-[#1c1c19] text-white">
      {/* Newsletter section */}
      <section className="bg-[var(--store-primary)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 sm:px-6 md:grid-cols-[1fr_1.1fr] md:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Stay inspired
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Join our furniture newsletter
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
              Receive new arrivals, interior inspiration and
              exclusive offers directly in your inbox.
            </p>
          </div>

          <div className="flex flex-col gap-3 bg-white p-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                className="h-12 w-full bg-white pl-12 pr-4 text-sm text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-[#1c1c19] px-6 text-sm font-semibold text-white transition hover:bg-black"
            >
              Subscribe
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand and contact */}
          <div className="lg:col-span-5">
            <Link
              href="/store"
              aria-label="Go to store home"
              className="inline-flex items-center"
            >
              <LogoComponent />
            </Link>

            {footer?.description?.trim() && (
              <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
                {footer.description}
              </p>
            )}

            {hasContactInformation && (
              <div className="mt-8 space-y-4">
                {footer?.address?.trim() && (
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center border border-white/10 bg-white/5 text-[var(--store-primary)]">
                      <MapPin className="size-[18px]" />
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                        Visit us
                      </p>

                      <p className="mt-1 max-w-sm text-sm leading-6 text-white/65">
                        {footer.address}
                      </p>
                    </div>
                  </div>
                )}

                {footer?.phone?.trim() && (
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center border border-white/10 bg-white/5 text-[var(--store-primary)]">
                      <Phone className="size-[18px]" />
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                        Call us
                      </p>

                      <a
                        href={`tel:${footer.phone}`}
                        className="mt-1 block text-sm text-white/65 transition hover:text-[var(--store-primary)]"
                      >
                        {footer.phone}
                      </a>
                    </div>
                  </div>
                )}

                {footer?.email?.trim() && (
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center border border-white/10 bg-white/5 text-[var(--store-primary)]">
                      <Mail className="size-[18px]" />
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                        Email us
                      </p>

                      <a
                        href={`mailto:${footer.email}`}
                        className="mt-1 block break-all text-sm text-white/65 transition hover:text-[var(--store-primary)]"
                      >
                        {footer.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social links */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => {
                if (!social.href?.trim()) {
                  return null;
                }

                const SocialIcon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid size-11 place-items-center border border-white/10 bg-white/5 text-white/70 transition hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                  >
                    <SocialIcon className="size-[18px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer navigation */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-[var(--store-primary)]" />

                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                      {group.title}
                    </h3>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
                        >
                          <ArrowRight className="size-3.5 -translate-x-1 opacity-0 text-[var(--store-primary)] transition group-hover:translate-x-0 group-hover:opacity-100" />

                          <span className="transition group-hover:translate-x-1">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Furniture message */}
            <div className="mt-12 border-l-2 border-[var(--store-primary)] bg-white/[0.04] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--store-primary)]">
                Designed for better living
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                Discover thoughtfully selected furniture that
                combines comfort, function and timeless design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <Logo textColor="#ffffff" />

          {footer?.copyrightText?.trim() && (
            <p className="text-xs leading-5 text-white/45 sm:text-sm">
              {footer.copyrightText}
            </p>
          )}

          <p className="text-xs text-white/45 sm:text-sm">
            Developed by{" "}
            <Link
              href="https://fleek.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--store-primary)] transition hover:text-white"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FurnitureFooter;