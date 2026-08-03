import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
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

const ElectronicFooter = ({
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
    <footer className="border-t border-gray-200 bg-gray-50 text-gray-900">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Link
              href="/store"
              aria-label="Go to store home"
              className="inline-flex items-center"
            >
              <LogoComponent />
            </Link>

            {footer?.description?.trim() && (
              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500">
                {footer.description}
              </p>
            )}

            {/* Social links */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
                    className="grid size-10 place-items-center rounded-md border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md"
                  >
                    <SocialIcon className="size-[17px]" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation sections */}
          <div className="sm:col-span-2 lg:col-span-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    {group.title}
                  </h3>

                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="inline-flex text-sm text-gray-700 transition-colors hover:text-blue-600"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Contact
            </h3>

            {hasContactInformation ? (
              <div className="space-y-4">
                {footer?.phone?.trim() && (
                  <a
                    href={`tel:${footer.phone}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                      <Phone className="size-4" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="mt-0.5 break-words text-sm text-gray-700 transition-colors group-hover:text-blue-600">
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
                    <span className="grid size-9 shrink-0 place-items-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                      <Mail className="size-4" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs text-gray-400">
                        Email
                      </p>

                      <p className="mt-0.5 break-all text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                        {footer.email}
                      </p>
                    </div>
                  </a>
                )}

                {footer?.address?.trim() && (
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md border border-gray-200 bg-white text-gray-500">
                      <MapPin className="size-4" />
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs text-gray-400">
                        Address
                      </p>

                      <p className="mt-0.5 text-sm leading-6 text-gray-700">
                        {footer.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="max-w-xs text-sm leading-6 text-gray-500">
                Contact information will appear here when it is
                added from the website settings.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />

            <span className="hidden h-5 w-px bg-gray-200 sm:block" />

            <span className="hidden text-xs text-gray-400 sm:inline">
              Secure online shopping
            </span>
          </div>

          {footer?.copyrightText?.trim() && (
            <p className="text-xs leading-5 text-gray-500 sm:text-sm">
              {footer.copyrightText}
            </p>
          )}

          <p className="text-xs text-gray-500 sm:text-sm">
            Developed by{" "}
            <Link
              href="https://fleek.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 transition-colors hover:text-blue-600"
            >
              Fleek Bangladesh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ElectronicFooter;