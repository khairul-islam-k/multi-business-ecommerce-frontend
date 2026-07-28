"use client";

import React, { useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Grid2X2,
  List,
  Minus,
  Plus,
} from "lucide-react";

import ProductCard from "../_components/product-card";
import {
  useProductCategoryQuery,
  useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";
import Loader from "@/components/shared/loader";
import { SortOrder } from "@/lib/api";
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

type Category = {
  id: string;
  businessId?: string;
  parentId: string | null;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  status?: string;
};

type CategoryTreeItem = {
  category: Category;
  children: CategoryTreeItem[];
};

type CategorySidebarItemProps = {
  item: CategoryTreeItem;
  activeCategoryId?: string;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

const CategorySidebarItem = ({
  item,
  activeCategoryId,
  onCategoryClick,
}: CategorySidebarItemProps) => {
  const [open, setOpen] = useState(false);

  const hasChildren =
    item.children.length > 0;

  const isActive =
    activeCategoryId === item.category.id;

  return (
    <div>
      <div
        className={`flex items-center rounded-lg transition ${isActive
            ? "bg-[var(--store-bg-2)]"
            : "hover:bg-[var(--store-bg-2)]"
          }`}
      >
        <button
          type="button"
          onClick={() =>
            onCategoryClick(item.category.id)
          }
          className={`min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm font-medium transition ${isActive
              ? "text-[var(--store-primary)]"
              : "text-[var(--store-text-primary)] hover:text-[var(--store-primary)]"
            }`}
        >
          {item.category.name}
        </button>

        {hasChildren && (
          <button
            type="button"
            onClick={() =>
              setOpen((previous) => !previous)
            }
            aria-label={
              open
                ? `Collapse ${item.category.name}`
                : `Expand ${item.category.name}`
            }
            aria-expanded={open}
            className="mr-1 grid size-8 shrink-0 place-items-center rounded-md text-[var(--store-muted)] transition hover:bg-[var(--store-bg-1)] hover:text-[var(--store-primary)]"
          >
            {open ? (
              <Minus className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="ml-4 mt-1 border-l border-[var(--store-border)] pl-3">
          {item.children.map((child) => (
            <CategorySidebarItem
              key={child.category.id}
              item={child}
              activeCategoryId={
                activeCategoryId
              }
              onCategoryClick={
                onCategoryClick
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ToyProductPage = ({
  search,
  categoryId,
  brandId,
  theme,
  dashboardColor,
}: ProductProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [sortBy, setSortBy] =
    useState<string>("createdAt");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("desc");

  const [viewMode, setViewMode] = useState<
    "grid" | "list"
  >("grid");

  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const total = products?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useProductCategoryQuery();

  const productItems = products?.items ?? [];

  const handleCategoryClick = (
    id: string,
  ) => {
    const params = new URLSearchParams();

    params.set("categoryId", id);

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    router.push(
      `${pathname}?${params.toString()}`,
    );
  };

  const handleClearCategory = () => {
    const params = new URLSearchParams();

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname,
    );
  };

  const handleToggleSortOrder = () => {
    setSortOrder((previous) =>
      previous === "desc" ? "asc" : "desc",
    );
  };

  if (
    categoriesLoading ||
    categoriesFetching
  ) {
    return <Loader />;
  }

  return (
    <section className="bg-[var(--store-bg-3)] py-6 sm:py-8">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8">
        {/* Desktop sidebar */}
        <aside className="hidden h-fit rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] p-5 shadow-sm lg:sticky lg:top-24 lg:block">
          {/* Sidebar heading */}
          <div className="border-b border-[var(--store-border)] pb-4">
            <h2 className="text-lg font-bold text-[var(--store-text-primary)]">
              Product Filters
            </h2>

            <p className="mt-1 text-xs text-[var(--store-muted)]">
              {productItems.length} products found
            </p>
          </div>

          {/* Categories */}
          <div className="border-b border-[var(--store-border)] py-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--store-text-primary)]">
              Categories
            </h3>

            <button
              type="button"
              onClick={handleClearCategory}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${!categoryId
                  ? "bg-[var(--store-bg-2)] text-[var(--store-primary)]"
                  : "text-[var(--store-text-primary)] hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                }`}
            >
              All Products
            </button>

            <div className="mt-1 space-y-1">
              {categories?.map((item) => (
                <CategorySidebarItem
                  key={item.category.id}
                  item={item}
                  activeCategoryId={categoryId}
                  onCategoryClick={
                    handleCategoryClick
                  }
                />
              ))}
            </div>
          </div>

          {/* Sort field */}
          <div className="border-b border-[var(--store-border)] py-5">
            <label
              htmlFor="product-sort"
              className="mb-3 block text-sm font-bold uppercase tracking-wide text-[var(--store-text-primary)]"
            >
              Sort by
            </label>

            <div className="relative">
              <select
                id="product-sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.currentTarget.value,
                  )
                }
                className="h-11 w-full appearance-none rounded-lg border border-[var(--store-border)] bg-[var(--store-bg-1)] px-3 pr-9 text-sm text-[var(--store-text-primary)] outline-none transition focus:border-[var(--store-primary)]"
              >
                <option value="name">
                  Name
                </option>

                <option value="price">
                  Price
                </option>

                <option value="createdAt">
                  Created date
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--store-muted)]" />
            </div>
          </div>

          {/* Sort direction */}
          <div className="border-b border-[var(--store-border)] py-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--store-text-primary)]">
              Sort direction
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setSortOrder("asc")
                }
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${sortOrder === "asc"
                    ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white"
                    : "border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
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
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${sortOrder === "desc"
                    ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white"
                    : "border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
                  }`}
              >
                <ArrowDownAZ className="size-4" />
                DESC
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleSortOrder}
              className="mt-2 w-full rounded-lg border border-[var(--store-border)] px-3 py-2 text-xs font-medium text-[var(--store-muted)] transition hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
            >
              Toggle sort direction
            </button>
          </div>

          {/* View mode */}
          <div className="pt-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--store-text-primary)]">
              View
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setViewMode("grid")
                }
                aria-label="Grid view"
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${viewMode === "grid"
                    ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white"
                    : "border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
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
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${viewMode === "list"
                    ? "border-[var(--store-primary)] bg-[var(--store-primary)] text-white"
                    : "border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] hover:border-[var(--store-primary)] hover:text-[var(--store-primary)]"
                  }`}
              >
                <List className="size-4" />
                List
              </button>
            </div>
          </div>
        </aside>

        {/* Product content */}
        <main className="min-w-0">
          {productsLoading ||
            productsFetching ? (
            <Loader />
          ) : productItems.length > 0 ? (
            <div>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid grid-cols-1 gap-5"
                }
              >
                {productItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    viewMode={viewMode}
                    product={product}
                    theme={theme}
                    dashboardColor={
                      dashboardColor
                    }
                  />
                ))}
              </div>

              <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}

              />
              
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] px-6 py-16 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[var(--store-text-primary)]">
                No products found
              </h3>

              <p className="mt-2 text-sm text-[var(--store-muted)]">
                Try another category or clear
                the category filter.
              </p>

              <button
                type="button"
                onClick={handleClearCategory}
                className="mt-5 rounded-lg bg-[var(--store-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View All Products
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default ToyProductPage;