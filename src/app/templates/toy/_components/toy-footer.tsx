import {
  ArrowRight,
  Clock3,
  Facebook,
  Gamepad2,
  Gift,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Puzzle,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
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

const ToyFooter = ({
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
      title: "Explore",
      links: [
        {
          label: "Home",
          href: "/store",
        },
        {
          label: "All Toys",
          href: "/store/products",
        },
        ...(hasAboutPage
          ? [
              {
                label: "Privacy Policy",
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
  ].filter(
    (section) => section.links.length > 0,
  );

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
    <footer className="relative overflow-hidden bg-[#17152f] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-28 size-72 rounded-full bg-[#ffcf3f]/10 blur-3xl" />

        <div className="absolute -right-24 bottom-24 size-80 rounded-full bg-[#ff5f8f]/10 blur-3xl" />

        <div className="absolute left-[45%] top-[35%] size-72 rounded-full bg-[#52c7ff]/5 blur-3xl" />

        <Sparkles className="absolute left-[7%] top-[28%] size-6 rotate-12 text-[#ffcf3f]/20" />

        <Star className="absolute right-[8%] top-[20%] size-7 -rotate-12 fill-[#ff77a9]/10 text-[#ff77a9]/20" />

        <Puzzle className="absolute bottom-[22%] left-[42%] size-8 rotate-12 text-[#62d8ff]/10" />
      </div>

      {/* Benefits strip */}
      <div className="relative border-b border-white/10 bg-white/[0.04]">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-7 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="group flex items-center gap-4">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[#ffcf3f] text-[#17152f] shadow-[0_10px_30px_-14px_rgba(255,207,63,0.75)] transition group-hover:-translate-y-1">
              <ShieldCheck className="size-6" />
            </span>

            <div>
              <p className="text-sm font-bold">
                Safe & trusted
              </p>

              <p className="mt-1 text-xs leading-5 text-white/55">
                Carefully selected for happy and safe
                playtime
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 md:border-l md:border-white/10 md:pl-7">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[#ff6f9f] text-white shadow-[0_10px_30px_-14px_rgba(255,111,159,0.75)] transition group-hover:-translate-y-1">
              <Truck className="size-6" />
            </span>

            <div>
              <p className="text-sm font-bold">
                Fast doorstep delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-white/55">
                Your favourite toys delivered quickly
                and securely
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 md:border-l md:border-white/10 md:pl-7">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[#59cbff] text-[#17152f] shadow-[0_10px_30px_-14px_rgba(89,203,255,0.75)] transition group-hover:-translate-y-1">
              <Clock3 className="size-6" />
            </span>

            <div>
              <p className="text-sm font-bold">
                Friendly support
              </p>

              <p className="mt-1 text-xs leading-5 text-white/55">
                We are here to make every order easier
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand information */}
          <div className="lg:col-span-4">
            <div className="inline-flex rounded-2xl bg-white px-4 py-2 shadow-lg">
              <LogoComponent />
            </div>

            {footer?.description?.trim() ? (
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                {footer.description}
              </p>
            ) : (
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                Bringing smiles, imagination and
                unforgettable playtime to children of
                every age.
              </p>
            )}

            {/* Playtime card */}
            <div className="relative mt-7 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] p-5">
              <div className="absolute -right-5 -top-5 size-24 rounded-full bg-[#ffcf3f]/15" />

              <div className="relative flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#ffcf3f] text-[#17152f]">
                  <Rocket className="size-6" />
                </span>

                <div>
                  <p className="text-sm font-bold">
                    Let imagination take off
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-white/50">
                    Toys that inspire creativity,
                    curiosity and joyful learning.
                  </p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-7">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Follow our fun
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
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
                      className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/70 transition duration-300 hover:-translate-y-1 hover:border-[#ffcf3f] hover:bg-[#ffcf3f] hover:text-[#17152f]"
                    >
                      <SocialIcon className="size-[18px]" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-x-7 gap-y-10 sm:grid-cols-3">
              {footerLinks.map((group, index) => {
                const headingColors = [
                  "text-[#ffcf3f]",
                  "text-[#ff8bb2]",
                  "text-[#70d7ff]",
                ];

                const dotColors = [
                  "bg-[#ffcf3f]",
                  "bg-[#ff8bb2]",
                  "bg-[#70d7ff]",
                ];

                return (
                  <div key={group.title}>
                    <h3
                      className={`text-sm font-extrabold uppercase tracking-[0.13em] ${
                        headingColors[
                          index % headingColors.length
                        ]
                      }`}
                    >
                      {group.title}
                    </h3>

                    <span
                      className={`mt-3 block h-1 w-9 rounded-full ${
                        dotColors[
                          index % dotColors.length
                        ]
                      }`}
                    />

                    <ul className="mt-6 space-y-3.5">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group inline-flex items-center gap-2.5 text-sm text-white/55 transition hover:text-white"
                          >
                            <span className="grid size-5 place-items-center rounded-full bg-white/[0.06] transition group-hover:bg-[#ffcf3f] group-hover:text-[#17152f]">
                              <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                            </span>

                            <span>{link.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact card */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-6">
              <div className="absolute right-0 top-0 size-28 translate-x-8 -translate-y-8 rounded-full bg-[#ff6f9f]/15" />

              <div className="absolute bottom-0 left-0 size-24 -translate-x-10 translate-y-10 rounded-full bg-[#59cbff]/10" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#ff6f9f] text-white shadow-lg">
                    <Gamepad2 className="size-5" />
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff9cbd]">
                      Need some help?
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      Talk to our team
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
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.07]">
                          <Phone className="size-[17px] text-[#ffcf3f]" />
                        </span>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
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
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.07]">
                          <Mail className="size-[17px] text-[#ff8bb2]" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
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
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.07]">
                          <MapPin className="size-[17px] text-[#70d7ff]" />
                        </span>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
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
                    Contact information will appear here
                    when it is added from the website
                    settings.
                  </p>
                )}

                <Link
                  href="/store/contact"
                  className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffcf3f] px-4 text-sm font-bold text-[#17152f] transition hover:-translate-y-0.5 hover:bg-[#ffe074]"
                >
                  Contact us

                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift banner */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-[#ffcf3f] px-6 py-7 text-[#17152f] sm:px-8">
          <div className="absolute -right-7 -top-10 size-36 rounded-full bg-white/25" />

          <div className="absolute bottom-0 right-[22%] size-20 translate-y-10 rounded-full bg-[#ff6f9f]/25" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#17152f] text-[#ffcf3f]">
                <Gift className="size-7" />
              </span>

              <div>
                <p className="text-lg font-extrabold">
                  Find the perfect little surprise
                </p>

                <p className="mt-1 text-sm text-[#17152f]/65">
                  Explore toys, gifts and joyful
                  discoveries for every occasion.
                </p>
              </div>
            </div>

            <Link
              href="/store/products"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#17152f] px-6 text-sm font-bold text-white transition hover:bg-[#292653]"
            >
              Shop now
              <ShoppingBag className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="relative border-t border-white/10 bg-[#100f24]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex items-center gap-3">
            <Logo textColor="#ffffff" />

            <span className="hidden h-5 w-px bg-white/15 sm:block" />

            <div className="hidden items-center gap-2 text-xs text-white/40 sm:flex">
              <Sparkles className="size-3.5 text-[#ffcf3f]" />
              Making every playtime magical
            </div>
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
              className="font-semibold text-[#ffcf3f] transition hover:text-white"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ToyFooter;