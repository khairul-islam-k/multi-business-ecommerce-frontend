import Link from "next/link";
import {
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    ShoppingBag,
    Twitter,
    Youtube,
} from "lucide-react";
import { FooterConfig } from "@/types/website/website";

const footerLinks = [
    {
        title: "Quick Links",
        links: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Contact Us", href: "/contact" },
        ],
    },
    {
        title: "Customer Service",
        links: [
            { label: "My Account", href: "/account" },
            { label: "Wishlist", href: "/wishlist" },
            { label: "Cart", href: "/cart" },
            { label: "Order Tracking", href: "/orders" },
        ],
    },
    {
        title: "Information",
        links: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms & Conditions", href: "/terms-condition" },
            { label: "Return Policy", href: "/return-policy" },
            { label: "FAQ", href: "/faq" },
        ],
    },
];

const FashionFooter = ({footer}: {footer: FooterConfig}) => {

    return (
        <footer className="bg-gray-950 text-white">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f16d59] text-white">
                                <ShoppingBag className="h-6 w-6" />
                            </span>

                            <span className="text-2xl font-bold">Fashion Store</span>
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
                            {
                                footer ? footer?.description : '_'
                            }
                        </p>

                        {/* Contact */}
                        <div className="mt-6 space-y-3 text-sm text-gray-400">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-[#f16d59]" />
                                <span>
                                    {
                                        footer ? footer?.address : '_'
                                    }
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-[#f16d59]" />
                                <span>
                                    {
                                        footer ? footer?.phone : '_'
                                    }
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-[#f16d59]" />
                                <span>
                                    {
                                        footer ? footer?.email : '_'
                                    }
                                </span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                href="#"
                                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>

                            <Link
                                href="#"
                                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>

                            <Link
                                href="#"
                                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>

                            <Link
                                href="#"
                                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f16d59]"
                            >
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-lg font-bold text-white">{group.title}</h3>

                            <ul className="mt-5 space-y-3">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 transition-all duration-300 hover:pl-1 hover:text-[#f16d59]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-14 rounded-3xl bg-white/5 p-6 sm:p-8">
                    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                Subscribe To Our Newsletter
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                Get latest updates, new arrivals, and special offers.
                            </p>
                        </div>

                        <form className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 flex-1 rounded-full border border-white/10 bg-white px-5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                            />

                            <button
                                type="submit"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f16d59] px-7 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-950"
                            >
                                Subscribe
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-sm text-gray-400 sm:flex-row sm:px-6 lg:px-8">
                    <p>
                        {
                            footer ? footer?.copyrightText : '_'
                        }
                    </p>

                    <p>
                        Developed by{" "}
                        <span className="font-semibold text-[#f16d59]">
                            Fleek Bangladesh
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FashionFooter;