"use client";

import {
  ChevronDown,
  CircleHelp,
  Headphones,
  Mail,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type FAQCategory =
  | "All"
  | "Orders"
  | "Shipping"
  | "Returns"
  | "Payments"
  | "Products";

type FAQItem = {
  id: number;
  category: Exclude<FAQCategory, "All">;
  question: string;
  answer: string;
};

const categories: FAQCategory[] = [
  "All",
  "Orders",
  "Shipping",
  "Returns",
  "Payments",
  "Products",
];

const faqItems: FAQItem[] = [
  {
    id: 1,
    category: "Orders",
    question: "How can I place an order?",
    answer:
      "Choose your preferred product, select the size, color and quantity, then click Add to Cart. Review your cart and continue to checkout to complete the order.",
  },
  {
    id: 2,
    category: "Orders",
    question: "How can I track my order?",
    answer:
      "After your order is shipped, you will receive a tracking number by email or SMS. You can also check the order status from your account.",
  },
  {
    id: 3,
    category: "Orders",
    question: "Can I cancel or change my order?",
    answer:
      "You can request a cancellation or modification before the order is processed. Contact our support team as soon as possible with your order number.",
  },
  {
    id: 4,
    category: "Shipping",
    question: "How long does delivery take?",
    answer:
      "Delivery inside Dhaka usually takes 1–3 business days. Delivery outside Dhaka normally takes 3–5 business days.",
  },
  {
    id: 5,
    category: "Shipping",
    question: "What are your delivery charges?",
    answer:
      "Delivery charges depend on your location, order weight and courier service. The exact amount will be displayed during checkout.",
  },
  {
    id: 6,
    category: "Shipping",
    question: "Do you provide international shipping?",
    answer:
      "International shipping may be available for selected countries. Please contact our support team to confirm availability and shipping costs.",
  },
  {
    id: 7,
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "Eligible products can be returned within 7 days of delivery. Products must be unused, unwashed and returned with their original tags and packaging.",
  },
  {
    id: 8,
    category: "Returns",
    question: "How can I exchange a product?",
    answer:
      "Contact our support team with your order number and exchange reason. Our team will provide the necessary instructions.",
  },
  {
    id: 9,
    category: "Returns",
    question: "How long does a refund take?",
    answer:
      "After the returned product passes inspection, the refund is normally processed within 5–10 business days.",
  },
  {
    id: 10,
    category: "Payments",
    question: "Which payment methods do you accept?",
    answer:
      "We accept cash on delivery, mobile banking, cards and supported online payment gateways. Available methods will be shown during checkout.",
  },
  {
    id: 11,
    category: "Payments",
    question: "Is online payment secure?",
    answer:
      "Yes. Online payments are processed through secure payment providers. We do not directly store your payment credentials.",
  },
  {
    id: 12,
    category: "Payments",
    question: "Why did my payment fail?",
    answer:
      "A payment may fail because of insufficient balance, an incorrect payment detail, a network issue, a bank restriction or an expired session.",
  },
  {
    id: 13,
    category: "Products",
    question: "How can I choose the correct size?",
    answer:
      "Check the size guide on the product details page and compare your body measurements with the provided chart.",
  },
  {
    id: 14,
    category: "Products",
    question: "Will the product color match the image?",
    answer:
      "We try to display product colors accurately, but the actual color may vary slightly because of lighting, photography or screen settings.",
  },
  {
    id: 15,
    category: "Products",
    question: "How will I know when a product is back in stock?",
    answer:
      "Follow our social media pages, subscribe to our newsletter or contact support to receive product restock information.",
  },
];

const helpCategories = [
  {
    id: 1,
    title: "Orders" as FAQCategory,
    description: "Placing, changing and tracking your orders",
    icon: ShoppingBag,
  },
  {
    id: 2,
    title: "Shipping" as FAQCategory,
    description: "Delivery times, locations and shipping costs",
    icon: Truck,
  },
  {
    id: 3,
    title: "Returns" as FAQCategory,
    description: "Returns, exchanges and refund information",
    icon: Undo2,
  },
  {
    id: 4,
    title: "Payments" as FAQCategory,
    description: "Payment methods, security and failed payments",
    icon: ShieldCheck,
  },
];

const FashionFAQ = () => {
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory>("All");

  const [activeFAQ, setActiveFAQ] = useState<number | null>(1);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.question.toLowerCase().includes(normalizedSearch) ||
        item.answer.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (category: FAQCategory) => {
    setActiveCategory(category);
    setActiveFAQ(null);
  };

  const handleToggleFAQ = (id: number) => {
    setActiveFAQ((currentId) => (currentId === id ? null : id));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveFAQ(null);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--store-bg-2)] py-16 sm:py-20">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#f16d59]/10 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#f16d59]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
            <CircleHelp className="h-7 w-7" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
            Help Center
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Find answers about our fashion products, orders, payments,
            deliveries, returns and refunds.
          </p>

          <div className="relative mx-auto mt-8 max-w-2xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your question..."
              className="h-14 w-full rounded-full border border-gray-200 bg-[var(--store-bg-1)] pl-14 pr-6 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#f16d59] focus:ring-4 focus:ring-[#f16d59]/10"
            />
          </div>
        </div>
      </section>

      {/* Help Category Cards */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#f16d59]">
              Browse Topics
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              How Can We Help You?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {helpCategories.map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.title;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCategoryChange(item.title)}
                  className={`group rounded-3xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#f16d59] hover:shadow-lg ${
                    isActive
                      ? "border-[#f16d59] bg-[#f16d59]/5 shadow-lg"
                      : "border-gray-200 bg-[var(--store-bg-1)]"
                  }`}
                >
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#f16d59] text-white"
                        : "bg-[#f16d59]/10 text-[#f16d59] group-hover:bg-[#f16d59] group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {/* Category Filters */}
              <div className="mb-7 flex flex-wrap gap-3">
                {categories.map((category) => {
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`h-10 rounded-full px-5 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gray-950 text-white"
                          : "border border-gray-200 bg-[var(--store-bg-1)] text-gray-500 hover:border-[#f16d59] hover:text-[#f16d59]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((item) => {
                    const isOpen = activeFAQ === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`overflow-hidden rounded-3xl border bg-[var(--store-bg-1)] transition-all duration-300 ${
                          isOpen
                            ? "border-[#f16d59] shadow-lg shadow-[#f16d59]/5"
                            : "border-gray-200 hover:border-[#f16d59]/50"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleFAQ(item.id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${item.id}`}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-300 ${
                                isOpen
                                  ? "bg-[#f16d59] text-white"
                                  : "bg-[#f16d59]/10 text-[#f16d59]"
                              }`}
                            >
                              {String(item.id).padStart(2, "0")}
                            </div>

                            <div>
                              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#f16d59]">
                                {item.category}
                              </span>

                              <h3 className="text-base font-bold leading-6 sm:text-lg">
                                {item.question}
                              </h3>
                            </div>
                          </div>

                          <div
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                              isOpen
                                ? "rotate-180 bg-[#f16d59] text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </div>
                        </button>

                        <div
                          id={`faq-answer-${item.id}`}
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-gray-100 px-5 pb-6 pt-5 sm:ml-[80px] sm:px-6">
                              <p className="text-sm leading-7 text-gray-500">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-[var(--store-bg-1)] px-6 py-16 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-300" />

                    <h3 className="mt-5 text-xl font-bold">
                      No Questions Found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-500">
                      We could not find any FAQ matching your search. Try
                      another keyword or contact our support team.
                    </p>

                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-gray-950 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-[#f16d59]"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Support Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-3xl bg-gray-950 p-7 text-white sm:p-8">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-[#f16d59]">
                  <Headphones className="h-7 w-7" />
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#f16d59]">
                  Need More Help?
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  Talk With Our Support Team
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  Could not find the answer you need? Our support team is ready
                  to help with your product or order questions.
                </p>

                <Link
                  href="/store/contact"
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f16d59] px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-950"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </Link>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-[var(--store-bg-1)] p-7">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f16d59]/10 text-[#f16d59]">
                  <Mail className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-xl font-bold">Email Support</h3>

                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Send your question by email and our support team will reply
                  as soon as possible.
                </p>

                <Link
                  href="mailto:support@fashionstore.com"
                  className="mt-5 inline-flex text-sm font-bold text-[#f16d59] transition hover:text-gray-950"
                >
                  support@fashionstore.com
                </Link>
              </div>

              <div className="rounded-3xl border border-[#f16d59]/20 bg-[#f16d59]/5 p-7">
                <PackageCheck className="h-9 w-9 text-[#f16d59]" />

                <h3 className="mt-4 text-xl font-bold">
                  Order Assistance
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Keep your order number ready when contacting support so our
                  team can help you faster.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#f16d59] px-6 py-12 text-center text-white sm:px-10">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

            <div className="absolute -bottom-14 -right-10 h-48 w-48 rounded-full bg-white/10" />

            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Still Have Questions?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80">
                Contact our support team for help with products, orders,
                payments, shipping, exchanges or returns.
              </p>

              <Link
                href="/store/contact"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-8 text-sm font-bold text-white transition-all duration-300 hover:bg-white hover:text-gray-950"
              >
                Contact Us
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FashionFAQ;