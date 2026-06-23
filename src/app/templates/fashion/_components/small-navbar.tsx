"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, LogIn } from "lucide-react";

const languages = [
    {
        code: "en",
        label: "English",
    },
    {
        code: "bn",
        label: "বাংলা",
    },
];

const SmallNavbar = () => {
    const [language, setLanguage] = useState("en");
    const [open, setOpen] = useState(false);

    const selectedLanguage = languages.find((item) => item.code === language);

    const handleLanguageChange = (code: string) => {
        setLanguage(code);
        setOpen(false);

        // Optional: store language
        localStorage.setItem("language", code);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-gray-950">
                    Fashion Store
                </Link>

                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setOpen((prev) => !prev)}
                            className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-[#f16d59] hover:text-[#f16d59]"
                        >
                            <Globe className="h-4 w-4" />
                            {selectedLanguage?.label}
                            <ChevronDown
                                className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                            />
                        </button>

                        {open && (
                            <div className="absolute right-0 top-12 w-36 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                                {languages.map((item) => (
                                    <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => handleLanguageChange(item.code)}
                                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${language === item.code
                                                ? "bg-[#f16d59]/10 text-[#f16d59]"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Login Button */}
                    <Link
                        href="/login"
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f16d59] px-5 text-sm font-semibold text-white transition hover:bg-gray-950"
                    >
                        <LogIn className="h-4 w-4" />
                        Login
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default SmallNavbar;