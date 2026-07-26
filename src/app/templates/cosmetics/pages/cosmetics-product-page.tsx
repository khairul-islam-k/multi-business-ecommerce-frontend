"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";

import ProductCard from "../_components/product-card";
import { useTemplateProductQuery } from "@/lib/api/hooks/public-website";
import Loader from "@/components/shared/loader";
import type { SortOrder } from "@/lib/api";
import type {
  DashboardColors,
  ThemeConfig,
} from "@/types/website/website";
import Pagination from "@/app/store/_components/pagination";

type ProductProps = {
  categoryId?: string;
  theme?: ThemeConfig;
  dashboardColor?: DashboardColors;
  search?: string;
  brandId?: string;
};

const CosmeticsProductPage = ({
  search,
  categoryId,
  brandId,
  theme,
  dashboardColor,
}: ProductProps) => {
  const [sortBy, setSortBy] =
    useState<string>("createdAt");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("desc");

  const [viewMode, setViewMode] = useState<
    "grid" | "list"
  >("grid");

  const [currentPage, setCurrentPage] =
    useState(1);

  const limit = 12;

  const {
    data: products,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useTemplateProductQuery({
    categoryId,
    page: currentPage,
    brandId,
    sortBy,
    sortOrder,
    limit,
    search,
  });

  const productItems =
    products?.items ?? [];

  const total =
    products?.meta?.total ?? 0;

  const totalPages = Math.ceil(
    total / limit,
  );

  /*
   * Return to the first page whenever
   * any product filter changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    categoryId,
    brandId,
    search,
    sortBy,
    sortOrder,
  ]);

  return (
    <section className="min-h-screen bg-[var(--store-bg-3)] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--store-primary)]">
            Our collection
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[var(--store-text-primary)] sm:text-3xl">
            Explore Products
          </h1>

          <p className="mt-2 text-sm text-[var(--store-muted)]">
            Browse our latest products and
            discover something perfect for you.
          </p>
        </div>

        {/* Top filter toolbar */}
        <div className="mb-6 rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Result information */}
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
                <SlidersHorizontal className="size-5" />
              </span>

              <div>
                <h2 className="text-sm font-bold text-[var(--store-text-primary)]">
                  Product Filters
                </h2>

                <p className="mt-0.5 text-xs text-[var(--store-muted)]">
                  {total}{" "}
                  {total === 1
                    ? "product"
                    : "products"}{" "}
                  found
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[220px_auto_auto]">
              {/* Sort field */}
              <div>
                <label
                  htmlFor="product-sort"
                  className="mb-1.5 block text-xs font-semibold text-[var(--store-muted)]"
                >
                  Sort products by
                </label>

                <div className="relative">
                  <select
                    id="product-sort"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.currentTarget
                          .value,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] px-4 pr-10 text-sm font-medium text-[var(--store-text-primary)] outline-none transition focus:border-[var(--store-primary)] focus:ring-4 focus:ring-[var(--store-primary)]/10"
                  >
                    <option value="createdAt">
                      Newest products
                    </option>

                    <option value="name">
                      Product name
                    </option>

                    <option value="price">
                      Product price
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--store-muted)]" />
                </div>
              </div>

              {/* Sort direction */}
              <div>
                <p className="mb-1.5 text-xs font-semibold text-[var(--store-muted)]">
                  Sort direction
                </p>

                <div className="grid h-11 grid-cols-2 rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-2)] p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder("asc")
                    }
                    aria-label="Sort ascending"
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      sortOrder === "asc"
                        ? "bg-[var(--store-primary)] text-white shadow-sm"
                        : "text-[var(--store-muted)] hover:text-[var(--store-primary)]"
                    }`}
                  >
                    <ArrowUpAZ className="size-4" />
                    ASC
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder("desc")
                    }
                    aria-label="Sort descending"
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      sortOrder === "desc"
                        ? "bg-[var(--store-primary)] text-white shadow-sm"
                        : "text-[var(--store-muted)] hover:text-[var(--store-primary)]"
                    }`}
                  >
                    <ArrowDownAZ className="size-4" />
                    DESC
                  </button>
                </div>
              </div>

              {/* View mode */}
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="mb-1.5 text-xs font-semibold text-[var(--store-muted)]">
                  Product view
                </p>

                <div className="grid h-11 grid-cols-2 rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-2)] p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setViewMode("grid")
                    }
                    aria-label="Grid view"
                    aria-pressed={
                      viewMode === "grid"
                    }
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      viewMode === "grid"
                        ? "bg-[var(--store-primary)] text-white shadow-sm"
                        : "text-[var(--store-muted)] hover:text-[var(--store-primary)]"
                    }`}
                  >
                    <Grid2X2 className="size-4" />
                    Grid
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setViewMode("list")
                    }
                    aria-label="List view"
                    aria-pressed={
                      viewMode === "list"
                    }
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      viewMode === "list"
                        ? "bg-[var(--store-primary)] text-white shadow-sm"
                        : "text-[var(--store-muted)] hover:text-[var(--store-primary)]"
                    }`}
                  >
                    <List className="size-4" />
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product content */}
        <main className="min-w-0">
          {productsLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader />
            </div>
          ) : productItems.length > 0 ? (
            <div className="relative">
              {/* Fetching overlay */}
              {productsFetching && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center rounded-2xl bg-[var(--store-bg-3)]/60 pt-20 backdrop-blur-[1px]">
                  <Loader />
                </div>
              )}

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid grid-cols-1 gap-5"
                }
              >
                {productItems.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      viewMode={viewMode}
                      product={product}
                      theme={theme}
                      dashboardColor={
                        dashboardColor
                      }
                    />
                  ),
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={
                      setCurrentPage
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-20 text-center shadow-sm">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
                <SlidersHorizontal className="size-7" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[var(--store-text-primary)]">
                No products found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--store-muted)]">
                No products match your current
                filters. Try changing the sorting
                options or search keyword.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default CosmeticsProductPage;