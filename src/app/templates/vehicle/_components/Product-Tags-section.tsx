"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  useProductTagsQuery,
  useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";

import ProductCard from "./product-card";

type ProductTag = {
  id: string;
  name: string;
  description?: string | null;
};

type ProductTagSectionProps = {
  tag: ProductTag;
  index: number;
};

const ProductTagSection = ({
  tag,
  index,
}: ProductTagSectionProps) => {
  const {
    data: products,
    isLoading,
    isFetching,
  } = useTemplateProductQuery({
    tagId: tag.id,
  });

  const productItems = products?.items ?? [];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3),
        ease: "easeOut",
      }}
      className="border-b border-[var(--store-border)]"
    >
      {/* Tag section header */}
      <div className="flex items-end justify-between gap-4">
        <div>

          <h2 className="font-bold text-[var(--store-text-primary)] text-2xl my-2">
            {tag.name}
          </h2>

        </div>
      </div>

      {/* Loading */}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, itemIndex) => (
            <div
              key={itemIndex}
              className="animate-pulse overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)]"
            >
              <div className="aspect-square bg-[var(--store-bg-2)]" />

              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-[var(--store-bg-2)]" />
                <div className="h-4 w-1/2 rounded bg-[var(--store-bg-2)]" />
              </div>
            </div>
          ))}
        </div>
      ) : productItems.length > 0 ? (
        /* Products */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {productItems.map((product) => (
            <ProductCard
              key={product.id}
              activeId={tag.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-10 text-center">
          <p className="text-sm font-medium text-[var(--store-muted)]">
            No products found for {tag.name}.
          </p>
        </div>
      )}
    </motion.div>
  );
};

const ProductTagSectionPage = () => {
  const {
    data: productTags,
    isLoading,
    isFetching,
  } = useProductTagsQuery();

  const tags = productTags ?? [];

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl">
        {/* Main header */}

        {/* Tag loading */}
        {isLoading || isFetching ? (
          <div className="mt-12 space-y-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <div className="mb-7 space-y-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--store-bg-2)]" />
                  <div className="h-8 w-64 animate-pulse rounded bg-[var(--store-bg-2)]" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 5 }).map(
                    (_, productIndex) => (
                      <div
                        key={productIndex}
                        className="animate-pulse overflow-hidden rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)]"
                      >
                        <div className="aspect-square bg-[var(--store-bg-2)]" />

                        <div className="space-y-3 p-4">
                          <div className="h-4 w-3/4 rounded bg-[var(--store-bg-2)]" />
                          <div className="h-4 w-1/2 rounded bg-[var(--store-bg-2)]" />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : tags.length > 0 ? (
          /* Render a different section for every tag */
          <div className="">
            {tags.map((tag, index) => (
              <ProductTagSection
                key={tag.id}
                tag={tag}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-12 text-center">
            <p className="text-base font-medium text-[var(--store-muted)]">
              No product tags found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductTagSectionPage;