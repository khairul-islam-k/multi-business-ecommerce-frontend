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

const ShoesFooter = ({
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
    <footer className="overflow-hidden bg-[#f4f8f6] text-[#173c34]">
      {/* Support features */}
      <div className="border-y border-[#173c34]/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="group flex items-center gap-4 border-b border-[#173c34]/10 py-6 transition md:border-r md:border-b-0 md:px-6 md:first:pl-0">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e4f4ed] text-[#168261] transition group-hover:bg-[#168261] group-hover:text-white">
              <ShieldCheck className="size-5" />
            </span>

            <div>
              <p className="text-sm font-bold text-[#173c34]">
                Trusted products
              </p>

              <p className="mt-1 text-xs leading-5 text-[#637c75]">
                Carefully selected healthcare essentials
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 border-b border-[#173c34]/10 py-6 transition md:border-r md:border-b-0 md:px-6">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e4f4ed] text-[#168261] transition group-hover:bg-[#168261] group-hover:text-white">
              <Truck className="size-5" />
            </span>

            <div>
              <p className="text-sm font-bold text-[#173c34]">
                Quick delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-[#637c75]">
                Fast and secure delivery to your door
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 py-6 transition md:px-6 md:last:pr-0">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e4f4ed] text-[#168261] transition group-hover:bg-[#168261] group-hover:text-white">
              <Clock3 className="size-5" />
            </span>

            <div>
              <p className="text-sm font-bold text-[#173c34]">
                Customer support
              </p>

              <p className="mt-1 text-xs leading-5 text-[#637c75]">
                Helpful service whenever you need it
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative">
        <div className="pointer-events-none absolute -left-24 top-20 size-80 rounded-full bg-[#168261]/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-[#8bd5b8]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Brand section */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-[#173c34]/10 bg-white p-6 shadow-[0_20px_60px_rgba(16,74,60,0.08)] sm:p-8">
                <Link
                  href="/store"
                  aria-label="Go to store home"
                  className="inline-flex items-center"
                >
                  <LogoComponent />
                </Link>

                {footer?.description?.trim() && (
                  <p className="mt-6 max-w-sm text-sm leading-7 text-[#637c75]">
                    {footer.description}
                  </p>
                )}

                <div className="mt-7 flex items-center gap-4 rounded-2xl bg-[#edf7f2] p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#168261] shadow-sm">
                    <HeartPulse className="size-5" />
                  </span>

                  <div>
                    <p className="text-sm font-bold text-[#173c34]">
                      Health comes first
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#637c75]">
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
                        className="grid size-10 place-items-center rounded-full border border-[#173c34]/10 bg-white text-[#55716a] transition duration-300 hover:-translate-y-1 hover:border-[#168261] hover:bg-[#168261] hover:text-white hover:shadow-lg"
                      >
                        <SocialIcon className="size-[17px]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="lg:col-span-5">
              <div className="h-full rounded-3xl border border-[#173c34]/10 bg-white/60 p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
                  {footerLinks.map((group) => (
                    <div key={group.title}>
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-1 rounded-full bg-[#168261]" />

                        <h3 className="text-sm font-bold text-[#173c34]">
                          {group.title}
                        </h3>
                      </div>

                      <ul className="mt-6 space-y-4">
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="group inline-flex items-center gap-2 text-sm text-[#637c75] transition hover:text-[#168261]"
                            >
                              <ArrowRight className="size-3.5 -translate-x-1 text-[#168261] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />

                              <span className="-ml-5 transition duration-300 group-hover:ml-0">
                                {link.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="lg:col-span-3">
              <div className="h-full overflow-hidden rounded-3xl bg-[#173c34] p-6 text-white shadow-[0_20px_60px_rgba(16,74,60,0.18)]">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#83d7b6] text-[#173c34]">
                    <Pill className="size-5" />
                  </span>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#83d7b6]">
                      Need help?
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      Contact our pharmacy
                    </h3>
                  </div>
                </div>

                {hasContactInformation ? (
                  <div className="mt-8 space-y-4">
                    {footer?.phone?.trim() && (
                      <a
                        href={`tel:${footer.phone}`}
                        className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 transition hover:bg-white/[0.1]"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-[#83d7b6]">
                          <Phone className="size-4" />
                        </span>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Phone
                          </p>

                          <p className="mt-1 text-sm text-white/75 transition group-hover:text-white">
                            {footer.phone}
                          </p>
                        </div>
                      </a>
                    )}

                    {footer?.email?.trim() && (
                      <a
                        href={`mailto:${footer.email}`}
                        className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 transition hover:bg-white/[0.1]"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-[#83d7b6]">
                          <Mail className="size-4" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Email
                          </p>

                          <p className="mt-1 break-all text-sm text-white/75 transition group-hover:text-white">
                            {footer.email}
                          </p>
                        </div>
                      </a>
                    )}

                    {footer?.address?.trim() && (
                      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-[#83d7b6]">
                          <MapPin className="size-4" />
                        </span>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Address
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/75">
                            {footer.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-white/60">
                    Contact information will appear here when it
                    is added from the website settings.
                  </p>
                )}

                <Link
                  href="/store/contact"
                  className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#83d7b6] px-5 text-sm font-bold text-[#173c34] transition hover:bg-white"
                >
                  Contact support

                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-white/10 bg-[#102f29] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Logo textColor="#ffffff" />

            <span className="hidden h-6 w-px bg-white/15 sm:block" />

            <div className="flex items-center gap-2 text-xs text-white/50">
              <ShoppingBag className="size-3.5 text-[#83d7b6]" />
              Secure online pharmacy shopping
            </div>
          </div>

          {footer?.copyrightText?.trim() && (
            <p className="text-xs leading-5 text-white/50 sm:text-sm">
              {footer.copyrightText}
            </p>
          )}

          <p className="text-xs text-white/50 sm:text-sm">
            Developed by{" "}
            <Link
              href="https://fleek.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#83d7b6] transition hover:text-white"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ShoesFooter;