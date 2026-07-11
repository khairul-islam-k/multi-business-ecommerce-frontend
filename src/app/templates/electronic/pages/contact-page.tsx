"use client";

import { useState } from "react";
import { Clock, Mail, MapPin } from "lucide-react";

export default function ElectronicContactClient() {
    const [sent, setSent] = useState(false);

    return (
        <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">


            <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
                {/* Contact Info */}
                <div className="space-y-6">
                    <p className="mb-3 text-xs uppercase tracking-widest text-blue-600">
                        Contact
                    </p>

                    <h1 className="mb-12 text-5xl font-bold text-gray-900 md:text-6xl">
                        Get in touch
                    </h1>
                    <div className="flex gap-4">
                        <Mail className="mt-1 h-5 w-5 shrink-0 text-blue-600" />

                        <div>
                            <div className="mb-1 text-sm font-semibold text-gray-900">
                                Email
                            </div>

                            <a
                                href="mailto:hello@voltix.co"
                                className="text-gray-500 hover:text-blue-600"
                            >
                                hello@voltix.co
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-blue-600" />

                        <div>
                            <div className="mb-1 text-sm font-semibold text-gray-900">
                                Studio
                            </div>

                            <p className="text-gray-500">
                                Norrtullsgatan 6
                                <br />
                                Stockholm, Sweden
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Clock className="mt-1 h-5 w-5 shrink-0 text-blue-600" />

                        <div>
                            <div className="mb-1 text-sm font-semibold text-gray-900">
                                Hours
                            </div>

                            <p className="text-gray-500">
                                Mon–Fri · 09:00 – 18:00 CET
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    {sent ? (
                        <div className="py-12 text-center">
                            <div className="mb-2 text-2xl font-bold text-gray-900">
                                Thanks for reaching out!
                            </div>

                            <p className="text-sm text-gray-500">
                                We`ll get back to you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setSent(true);
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Name
                                    </label>

                                    <input
                                        required
                                        type="text"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Email
                                    </label>

                                    <input
                                        required
                                        type="email"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Subject
                                </label>

                                <input
                                    required
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Message
                                </label>

                                <textarea
                                    required
                                    rows={5}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white hover:opacity-90"
                            >
                                Send message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}