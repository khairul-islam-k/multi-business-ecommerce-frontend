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

const VehicleFooter = ({
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
                label: "Terms and Condition",
                href: "/store/term-condition",
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
    <footer className="relative overflow-hidden bg-[#090d12] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-40 size-[420px] rounded-full bg-[var(--store-primary)] opacity-[0.08] blur-3xl" />
        <div className="absolute -bottom-52 -left-24 size-[360px] rounded-full bg-[var(--store-primary)] opacity-[0.06] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--store-primary)] to-transparent opacity-70" />
      </div>

      {/* Newsletter */}
      <section className="relative z-10 px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-7xl overflow-hidden border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-[var(--store-primary)] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
              <div className="absolute -right-12 -top-20 size-56 rounded-full border-[42px] border-white/10" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Updates & Offers
                </p>

                <h2 className="mt-3 max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Get the latest vehicle deals in your inbox
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                  Be the first to discover new arrivals, special
                  promotions and important store updates.
                </p>
              </div>
            </div>

            <div className="flex items-center px-6 py-7 sm:px-8 lg:px-10">
              <div className="w-full">
                <p className="mb-3 text-sm font-medium text-white/65">
                  Subscribe to our newsletter
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-white/35" />

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      className="h-[52px] w-full border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--store-primary)] focus:bg-white/[0.08]"
                    />
                  </div>

                  <button
                    type="button"
                    className="group inline-flex h-[52px] shrink-0 items-center justify-center gap-2 bg-[var(--store-primary)] px-7 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Subscribe
                    <Send className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/store"
              aria-label="Go to store home"
              className="inline-flex items-center bg-white px-5 py-3"
            >
              <LogoComponent />
            </Link>

            {footer?.description?.trim() && (
              <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
                {footer.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
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
                    className="group grid size-11 place-items-center border border-white/10 bg-white/[0.04] text-white/60 transition hover:-translate-y-1 hover:border-[var(--store-primary)] hover:bg-[var(--store-primary)] hover:text-white"
                  >
                    <SocialIcon className="size-[18px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="relative pb-4 text-sm font-bold uppercase tracking-[0.13em] text-white">
                    {group.title}
                    <span className="absolute bottom-0 left-0 h-0.5 w-9 bg-[var(--store-primary)]" />
                  </h3>

                  <ul className="mt-6 space-y-3.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
                        >
                          <ArrowRight className="size-3.5 text-[var(--store-primary)] transition-transform group-hover:translate-x-1" />

                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact information */}
          <div className="lg:col-span-3">
            <h3 className="relative pb-4 text-sm font-bold uppercase tracking-[0.13em] text-white">
              Contact Information
              <span className="absolute bottom-0 left-0 h-0.5 w-9 bg-[var(--store-primary)]" />
            </h3>

            {hasContactInformation ? (
              <div className="mt-6 space-y-3">
                {footer?.address?.trim() && (
                  <div className="group flex items-start gap-3 border border-white/[0.08] bg-white/[0.035] p-4 transition hover:border-white/15 hover:bg-white/[0.055]">
                    <span className="grid size-10 shrink-0 place-items-center bg-[var(--store-primary)] text-white">
                      <MapPin className="size-[18px]" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        Address
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        {footer.address}
                      </p>
                    </div>
                  </div>
                )}

                {footer?.phone?.trim() && (
                  <div className="group flex items-start gap-3 border border-white/[0.08] bg-white/[0.035] p-4 transition hover:border-white/15 hover:bg-white/[0.055]">
                    <span className="grid size-10 shrink-0 place-items-center bg-[var(--store-primary)] text-white">
                      <Phone className="size-[18px]" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        Phone
                      </p>

                      <a
                        href={`tel:${footer.phone}`}
                        className="mt-1 block break-words text-sm text-white/65 transition hover:text-[var(--store-primary)]"
                      >
                        {footer.phone}
                      </a>
                    </div>
                  </div>
                )}

                {footer?.email?.trim() && (
                  <div className="group flex items-start gap-3 border border-white/[0.08] bg-white/[0.035] p-4 transition hover:border-white/15 hover:bg-white/[0.055]">
                    <span className="grid size-10 shrink-0 place-items-center bg-[var(--store-primary)] text-white">
                      <Mail className="size-[18px]" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                        Email
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
            ) : (
              <p className="mt-6 text-sm leading-6 text-white/45">
                Contact information is not available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="relative z-10 border-t border-white/[0.08] bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="shrink-0 opacity-90">
            <Logo textColor="#ffffff" />
          </div>

          {footer?.copyrightText?.trim() && (
            <p className="text-xs leading-5 text-white/40 sm:text-sm">
              {footer.copyrightText}
            </p>
          )}

          <p className="text-xs text-white/40 sm:text-sm">
            Developed by{" "}
            <Link
              href="https://fleek.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/70 transition hover:text-[var(--store-primary)]"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default VehicleFooter;