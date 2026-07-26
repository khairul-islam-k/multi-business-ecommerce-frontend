import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
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

const CosmeticsFooter = ({
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
        {
          label: "All Products",
          href: "/store/products",
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
      title: "Customer Care",
      links: [
        {
          label: "My Wishlist",
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
        {
          label: "My Account",
          href: "/store/dashboard",
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
  ].filter(
    (
      social,
    ): social is {
      label: string;
      href: string;
      icon: typeof Facebook;
    } => Boolean(social.href),
  );

  const hasContactInformation = Boolean(
    footer?.address ||
      footer?.phone ||
      footer?.email,
  );

  return (
    <footer className="relative pb-12 md:pb-0 overflow-hidden border-t border-rose-100 bg-[var(--store-footer-cosmetic)] dark:border-white/10 dark:bg-[#120f14] dark:text-white">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#f16d59]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl dark:bg-fuchsia-500/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-200/20 blur-3xl dark:bg-rose-500/10"
      />

      {/* Newsletter */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#f16d59] via-[#e75f7b] to-[#b95cc9] px-6 py-8 text-white shadow-[0_24px_70px_rgba(241,109,89,0.25)] sm:px-10 sm:py-10 lg:px-12">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/15 blur-2xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Beauty updates
              </div>

              <h2 className="mt-4 max-w-xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Discover new arrivals and exclusive offers
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Subscribe to receive product updates,
                beauty tips and special promotions directly
                in your inbox.
              </p>
            </div>

            <form className="rounded-2xl bg-white/10 p-2 backdrop-blur-md sm:flex sm:items-center sm:gap-2">
              <div className="relative min-w-0 flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="h-13 w-full rounded-xl border-0 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-white/20"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#251d22] px-6 text-sm font-bold text-white transition duration-300 hover:bg-white hover:text-[#251d22] sm:mt-0 sm:w-auto"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_2fr] lg:gap-14">
          {/* Brand card */}
          <div className="rounded-[28px] border border-[var(--store-border)] p-6 shadow-[0_20px_60px_rgba(78,46,58,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
            <div className="inline-flex max-w-full">
              <LogoComponent />
            </div>

            {footer?.description && (
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#766a6e] dark:text-white/60">
                {footer.description}
              </p>
            )}

            {hasContactInformation && (
              <div className="mt-7 space-y-3">
                {footer?.address && (
                  <div className="flex items-start gap-3 rounded-2xl bg-[var(--store-footer-cosmetic)] px-4 py-3 dark:bg-white/[0.04]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                      <MapPin className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/40">
                        Address
                      </p>

                      <p className="mt-1 break-words text-sm font-medium leading-6">
                        {footer.address}
                      </p>
                    </div>
                  </div>
                )}

                {footer?.phone && (
                  <Link
                    href={`tel:${footer.phone}`}
                    className="flex items-start gap-3 rounded-2xl px-4 py-3 transition hover:bg-[#f16d59]/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                      <Phone className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/40">
                        Phone
                      </p>

                      <p className="mt-1 break-all text-sm font-medium">
                        {footer.phone}
                      </p>
                    </div>
                  </Link>
                )}

                {footer?.email && (
                  <Link
                    href={`mailto:${footer.email}`}
                    className="flex items-start gap-3 rounded-2xl px-4 py-3 transition hover:bg-[#f16d59]/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                      <Mail className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider dark:text-white/40">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium">
                        {footer.email}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a29699] dark:text-white/40">
                  Follow us
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;

                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="group grid h-11 w-11 place-items-center rounded-full border border-rose-100 bg-[var(--store-bg-1)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70"
                      >
                        <SocialIcon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 rounded-[28px] border border-rose-100 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-8 md:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-[#f16d59]" />

                  <h3 className="text-base font-bold dark:text-white">
                    {group.title}
                  </h3>
                </div>

                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-sm transition duration-300 hover:text-[#f16d59] dark:text-white/60 dark:hover:text-[#f16d59]"
                      >
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          {link.label}
                        </span>

                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 md:col-span-3">
              <div className="mt-2 border-t border-rose-100 pt-6 dark:border-white/10">
                <p className="text-sm leading-7 dark:text-white/55">
                  Shop confidently and discover carefully
                  selected products designed for your everyday
                  beauty and lifestyle needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="relative z-10 border-t border-rose-100 dark:border-white/10 dark:bg-black/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div>
            <Logo textColor="var(--store-text-primary)" />
          </div>

          <p className="text-sm text-[#8b7e82] dark:text-white/50">
            {footer?.copyrightText ||
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>

          <p className="text-sm text-[#8b7e82] dark:text-white/50">
            Developed by{" "}
            <Link
              href="https://fleek.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#f16d59] transition hover:underline"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CosmeticsFooter;