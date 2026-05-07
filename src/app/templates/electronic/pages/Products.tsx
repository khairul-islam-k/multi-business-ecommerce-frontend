"use client";

import { useMemo, useState } from "react";
import { products } from "@/app/templates/electronic/_components/data/products";
import { ProductCard } from "@/app/templates/electronic/_components/product-card";

export default function ElectronicProductsPage() {
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }, []);

  const [filter, setFilter] = useState("All");

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((product) => product.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-widest text-blue-600">
            Catalog
          </p>

          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
            All products
          </h1>

          <p className="mt-3 max-w-xl text-gray-500">
            Carefully selected gear from the categories we believe in.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === category
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

    </div>
  );
}