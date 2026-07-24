import {
  ArrowRight,
  Clock3,
  Facebook,
  HeartPulse,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Pill,
  ShieldCheck,
  ShoppingBag,
  Truck,
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

const PharmacyFooter = ({
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
      title: "Company",
      links: [
        {
          label: "Home",
          href: "/store",
        },
        ...(hasAboutPage
          ? [
              {
                label: "Privacy policy",
                href: "/store/privacy",
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
      title: "My Account",
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
          label: "Order History",
          href: "/store/dashboard/order-history",
        },
      ],
    },
    {
      title: "Help & Support",
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
    <footer className="overflow-hidden bg-[#073b36] text-white">
      {/* Pharmacy support strip */}
      <div className="border-b border-white/10 bg-[#0d4b44]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center bg-white/10 text-[#9ee5c7]">
              <ShieldCheck className="size-6" />
            </span>

            <div>
              <p className="text-sm font-semibold">Trusted products</p>
              <p className="mt-1 text-xs leading-5 text-white/55">
                Carefully selected healthcare essentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-l md:border-white/10 md:pl-6">
            <span className="grid size-12 shrink-0 place-items-center bg-white/10 text-[#9ee5c7]">
              <Truck className="size-6" />
            </span>

            <div>
              <p className="text-sm font-semibold">Quick delivery</p>
              <p className="mt-1 text-xs leading-5 text-white/55">
                Fast and secure delivery to your door
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:border-l md:border-white/10 md:pl-6">
            <span className="grid size-12 shrink-0 place-items-center bg-white/10 text-[#9ee5c7]">
              <Clock3 className="size-6" />
            </span>

            <div>
              <p className="text-sm font-semibold">Customer support</p>
              <p className="mt-1 text-xs leading-5 text-white/55">
                Helpful service whenever you need it
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand section */}
          <div className="lg:col-span-4">
            <Link
              href="/store"
              aria-label="Go to store home"
              className="inline-flex items-center"
            >
              <LogoComponent />
            </Link>

            {footer?.description?.trim() && (
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                {footer.description}
              </p>
            )}

            <div className="mt-7 flex items-center gap-3 border-l-2 border-[#56c99a] bg-white/[0.05] px-5 py-4">
              <HeartPulse className="size-6 shrink-0 text-[#7ee0b8]" />

              <div>
                <p className="text-sm font-semibold text-white">
                  Health comes first
                </p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Everyday care, delivered with confidence.
                </p>
              </div>
            </div>

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
                    className="grid size-10 place-items-center border border-white/10 bg-white/5 text-white/65 transition hover:border-[#56c99a] hover:bg-[#56c99a] hover:text-[#073b36]"
                  >
                    <SocialIcon className="size-[17px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-x-7 gap-y-10 sm:grid-cols-3">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.13em] text-white">
                    {group.title}
                  </h3>

                  <span className="mt-3 block h-0.5 w-8 bg-[#56c99a]" />

                  <ul className="mt-6 space-y-3.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="group inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
                        >
                          <ArrowRight className="size-3.5 text-[#7ee0b8] transition group-hover:translate-x-1" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div className="lg:col-span-3">
            <div className="border border-white/10 bg-white/[0.05] p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center bg-[#56c99a] text-[#073b36]">
                  <Pill className="size-5" />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7ee0b8]">
                    Need help?
                  </p>
                  <h3 className="mt-1 text-lg font-bold">
                    Contact our pharmacy
                  </h3>
                </div>
              </div>

              {hasContactInformation ? (
                <div className="mt-7 space-y-5">
                  {footer?.phone?.trim() && (
                    <a
                      href={`tel:${footer.phone}`}
                      className="group flex items-start gap-3"
                    >
                      <Phone className="mt-0.5 size-[18px] shrink-0 text-[#7ee0b8]" />

                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/35">
                          Phone
                        </p>
                        <p className="mt-1 text-sm text-white/65 transition group-hover:text-white">
                          {footer.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {footer?.email?.trim() && (
                    <a
                      href={`mailto:${footer.email}`}
                      className="group flex items-start gap-3"
                    >
                      <Mail className="mt-0.5 size-[18px] shrink-0 text-[#7ee0b8]" />

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-white/35">
                          Email
                        </p>
                        <p className="mt-1 break-all text-sm text-white/65 transition group-hover:text-white">
                          {footer.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {footer?.address?.trim() && (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-[18px] shrink-0 text-[#7ee0b8]" />

                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/35">
                          Address
                        </p>
                        <p className="mt-1 text-sm leading-6 text-white/65">
                          {footer.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-6 text-white/55">
                  Contact information will appear here when it is added from the website settings.
                </p>
              )}

              <Link
                href="/store/contact"
                className="mt-7 flex h-11 w-full items-center justify-center gap-2 bg-[#56c99a] px-4 text-sm font-semibold text-[#073b36] transition hover:bg-[#7ee0b8]"
              >
                Contact support
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-white/10 bg-[#052f2b]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex items-center gap-3">
            <Logo textColor="#ffffff" />

            <span className="hidden h-5 w-px bg-white/15 sm:block" />

            <div className="hidden items-center gap-2 text-xs text-white/45 sm:flex">
              <ShoppingBag className="size-3.5" />
              Secure online pharmacy shopping
            </div>
          </div>

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
              className="font-semibold text-[#7ee0b8] transition hover:text-white"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PharmacyFooter;