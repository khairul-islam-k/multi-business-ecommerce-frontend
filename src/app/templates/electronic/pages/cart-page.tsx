"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";


export default function CartPage() {
  const params = useParams();

  const items = [];

  const domain = params.domain as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 md:text-5xl">
          Your cart
        </h1>

        {items.length ==0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="mb-6 text-gray-500">Your cart is empty.</p>

            <Link
              href={`/store/${domain}/products`}
              className="inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <div className="space-y-3">
              {/* {items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500">
                          {product.category}
                        </div>

                        <div className="font-bold text-gray-900">
                          {product.name}
                        </div>

                        <div className="text-sm text-gray-500">
                          ${product.price}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-md border border-gray-300"
                      >
                        −
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {qty}
                      </span>

                      <button
                        type="button"
                        className="h-8 w-8 rounded-md border border-gray-300"
                      >
                        +
                      </button>

                      <span className="ml-auto font-semibold text-gray-900">
                        ${(product.price * qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))} */}

              <button
                type="button"
                className="text-xs text-gray-500 underline hover:text-gray-900"
              >
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Order summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">0</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">
                    0
                  </span>
                </div>

                <div className="my-3 border-t border-gray-200" />

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>0</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-gray-900 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Checkout
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Secure checkout · Free returns
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}