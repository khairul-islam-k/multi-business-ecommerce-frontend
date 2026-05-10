import Link from "next/link";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { products } from "../_components/data/products";
import { ProductCard } from "../_components/product-card";
import RecentlyViewProduct from "../_components/recently-view-product";

export const metadata = {
  title: "Voltix — Premium Electronics Store",
  description:
    "Shop curated headphones, wearables, and tech accessories. Designed beautifully, built to last.",
};

const perks = [
  {
    icon: Truck,
    title: "Free shipping",
    text: "On orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "2-year warranty",
    text: "Every product covered",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    text: "No questions asked",
  },
  {
    icon: Headphones,
    title: "Expert support",
    text: "Real humans, 7 days",
  },
];

type Props = {
    site: {
        name: string;
        logo?: string;
        templateName: string;
        domain: string;
    };
};

export default function HomePage({ site }: Props) {
  const featured = products.slice(0, 4);

  console.log('site', site);

  const categories = Array.from(
    new Set(products.map((product) => product.category)),
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgb(248 250 252), rgb(239 246 255))",
        }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-5 md:grid-cols-2 md:px-10 md:py-10">
          <div>
            <span className="mb-6 inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              New season · 2026
            </span>

            <h1 className="mb-6 text-5xl font-bold leading-[0.95] tracking-tight text-gray-900 md:text-7xl">
              Tech that{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #2563eb, #7c3aed)",
                }}
              >
                feels right.
              </span>
            </h1>

            <p className="mb-8 max-w-md text-lg text-gray-600">
              Curated headphones, speakers, and wearables — beautifully
              designed, rigorously tested, ready to ship.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
              >
                Our story
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop"
                alt="Premium headphones"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:block">
              <div className="text-xs text-gray-500">Bestseller</div>
              <div className="font-bold text-gray-900">Ion-1 Headphones</div>
              <div className="font-bold text-blue-600">$349</div>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4 md:px-10">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <perk.icon className="h-6 w-6 shrink-0 text-blue-600" />

              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {perk.title}
                </div>
                <div className="text-xs text-gray-500">{perk.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Shop by category
          </h2>

          <Link
            href={`/store/${site.domain}/products`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category, index) => {
            const image = products.find(
              (product) => product.category === category,
            )?.image;

            return (
              <Link
                key={category}
                href={`/store/${site.domain}/products`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={image}
                  alt={category}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-[10px] uppercase tracking-widest opacity-80">
                    0{index + 1}
                  </div>
                  <div className="text-xl font-bold">{category}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-blue-600">
              Bestsellers
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Loved by thousands
            </h2>
          </div>

          <Link
            href={`/store/${site.domain}/products`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Shop all →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div
          className="relative overflow-hidden rounded-3xl p-10 text-center md:p-16"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          }}
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Get 10% off your first order
          </h2>

          <p className="mx-auto mb-8 max-w-md text-white/80">
            Join the Voltix newsletter for early access to drops and exclusive
            deals.
          </p>

          <form className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Your email"
              className="flex-1 rounded-full bg-white px-5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />

            <button
              type="button"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* recently view product */}
      <section>
        <RecentlyViewProduct />
      </section>

    </main>
  );
}