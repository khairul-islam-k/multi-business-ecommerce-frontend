"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { allProducts } from "./productData";
import ProductCard from "./product-card";

const productTabs = [
  {
    id: "new-arrival",
    label: "NEW ARRIVAL",
  },
  {
    id: "trending",
    label: "TRENDING",
  },
  {
    id: "best-selling",
    label: "BEST SELLING",
  },
  {
    id: "popular",
    label: "POPULAR",
  },
];

const ExploreOurProduct = () => {
  const [activeTab, setActiveTab] = useState(productTabs[0].id);

  const activeTabData = productTabs.find((tab) => tab.id === activeTab);

  const filteredProducts = allProducts.filter(
    (product) => product.tag.name === activeTabData?.label,
  );

  return (
    <section className="bg-[#f6f6f6] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-950 sm:text-4xl lg:text-5xl">
            Explore Our Products
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Discover our latest fashion collection and trending products.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          {productTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-[#f16d59]"
                    : "text-gray-600 hover:text-[#f16d59]"
                }`}
              >
                {tab.label}

                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#f16d59] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Products */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-base font-medium text-gray-500">
                No products found.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreOurProduct;