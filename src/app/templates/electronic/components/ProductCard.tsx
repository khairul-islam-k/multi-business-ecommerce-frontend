"use client";

import Link from "next/link";


import type { Product } from "./data/products";
import { useCart } from "./contex/CartContex";
import { useParams } from "next/navigation";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { domain } = useParams();

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
      <Link
        href={`/store/${domain}/products`}
        className="block aspect-square overflow-hidden bg-gray-100"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-5">
        <div className="mb-1 text-[10px] uppercase tracking-widest text-gray-500">
          {product.category}
        </div>

        <h3 className="mb-1 text-lg font-bold leading-tight text-gray-900">
          {product.name}
        </h3>

        <p className="mb-4 line-clamp-1 text-[11px] text-gray-500">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>

          <button
            type="button"
            onClick={() => add(product)}
            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}