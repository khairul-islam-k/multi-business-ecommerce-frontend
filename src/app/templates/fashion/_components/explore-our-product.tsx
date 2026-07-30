"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ProductCard from "./product-card";
import { useProductTagsQuery, useTemplateProductQuery } from "@/lib/api/hooks/public-website";


const ExploreOurProduct = () => {
  const { data: productTabs } = useProductTagsQuery({
    limit: 10
  });
  const [activeTab, setActiveTab] = useState('');

  const {data: products} = useTemplateProductQuery({
    tagId: activeTab
  });


  useEffect(() => {
    if (productTabs) {
      setActiveTab(productTabs[0]?.id);
    }
  }, [productTabs]);

  return (
    <section className="bg-[var(--store-bg-3)] py-8 mt-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">
            Explore Our Products
          </h2>

          <p className="mt-4 text-base leading-7">
            Discover our latest fashion collection and trending products.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-4 w-full overflow-x-auto overflow-y-hidden">
          <div className="flex w-max min-w-full items-center justify-start gap-8 px-4 md:justify-center">
            {productTabs?.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 ${isActive
                      ? "text-[#f16d59]"
                      : "hover:text-[#f16d59]"
                    }`}
                >
                  {tab.name}

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#f16d59] transition-all duration-300 ${isActive ? "w-full" : "w-0"
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Products */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
            >
              {products?.items.map((product) => (
                <ProductCard key={product.id}
                activeId={activeTab}
                product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {products?.items.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-[var(--store-bg-1)] p-10 text-center">
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