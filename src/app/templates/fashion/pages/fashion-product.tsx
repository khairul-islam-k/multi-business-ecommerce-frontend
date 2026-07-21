"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  Grid2X2,
  List,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import ProductCard from "../_components/product-card";
import {
  useProductCategoryQuery,
  useTemplateProductQuery,
} from "@/lib/api/hooks/public-website";
import Loader from "@/components/shared/loader";
import { SortOrder } from "@/lib/api";
import { DashboardColors, ThemeConfig } from "@/types/website/website";
import { useDebounce } from "use-debounce";

type ProductProps = {
  categoryId?: string;
  theme?: ThemeConfig;
  dashboardColor?: DashboardColors;
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

const CategorySidebarItem = ({
  item,
  activeCategoryId,
  onCategoryClick,
}: {
  item: CategoryTreeItem;
  activeCategoryId?: string;
  onCategoryClick: (categoryId: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children.length > 0;
  const isActive = activeCategoryId === item.category.id;

  return (
    <div>
      <button
        type="button"
        onClick={() => onCategoryClick(item.category.id)}
        className={`flex w-full items-center justify-between py-2 text-left text-sm font-medium transition ${isActive ? "text-[#f16d59]" : " hover:text-[#f16d59]"
          }`}
      >
        <span>{item.category.name}</span>

        {hasChildren && (
          <span
            onClick={(event) => {
              event.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="grid h-6 w-6 place-items-center"
          >
            {open ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </span>
        )}
      </button>

      {hasChildren && open && (
        <div className="ml-4 border-l border-gray-200 pl-4">
          {item.children.map((child) => (
            <CategorySidebarItem
              key={child.category.id}
              item={child}
              activeCategoryId={activeCategoryId}
              onCategoryClick={onCategoryClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FashionProduct = ({
  categoryId,
  theme,
  dashboardColor
}: ProductProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [searchText, setSearchText] = useState<string>('');
  const [search] = useDebounce(searchText, 500);

  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data: products } = useTemplateProductQuery({
    categoryId,
    sortBy,
    sortOrder,
    search
  });

  // all categories
  const { data: categories, isLoading, isFetching } = useProductCategoryQuery();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCategoryClick = (id: string) => {
    router.push(`${pathname}?categoryId=${id}`);
  };

  const handleClearCategory = () => {
    router.push(pathname);
  };

  const productItems = products?.items ?? [];

  if (isLoading || isFetching) return <Loader />;

  return (
    <section className="bg-[var(--store-bg-3)] py-8">

      {/* search field */}
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-8 text-center">
        <h3 className="text-2xl font-bold text-[var(--store-text-primary)] sm:text-3xl">
          Products
        </h3>

        <p className="mt-2 text-sm text-[var(--store-text-secondary)]">
          Find your favorite products
        </p>

        <div className="relative mt-5 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-text-secondary)]" />

          <input
            type="search"
            onChange={(e) => setSearchText(e.currentTarget.value)}
            placeholder="Search products..."
            className="h-12 w-full rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] py-2 pl-12 pr-5 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-[var(--store-text-secondary)] focus:border-[var(--store-primary)] focus:ring-2 focus:ring-[var(--store-primary)]/20"
          />
        </div>
      </div>


      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[270px_1fr] lg:px-8">
        {/* Left Sidebar */}
        <aside className="h-fit bg-[var(--store-bg-1)] p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold">Product categories</h2>

            <SlidersHorizontal className="h-5 w-5 text-gray-500 lg:hidden" />
          </div>

          <button
            type="button"
            onClick={handleClearCategory}
            className={`mt-5 block w-full text-left text-sm font-medium transition ${!categoryId ? "text-[#f16d59]" : "hover:text-[#f16d59]"
              }`}
          >
            All Products
          </button>

          <div className="mt-3 space-y-1">
            {categories?.map((item) => (
              <CategorySidebarItem
                key={item.category.id}
                item={item}
                activeCategoryId={categoryId}
                onCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        </aside>

        {/* Right Content */}
        <div>
          {/* Top Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 bg-[var(--store-bg-1)] p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl font-bold md:text-2xl">
              Total Products Found: {products?.items.length}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-lg font-semibold">Sort by:</label>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-12 w-48 appearance-none rounded-md border border-gray-300 bg-[var(--store-bg-1)] px-4 pr-10 text-sm outline-none focus:border-[#f16d59]"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="createdAt">CreatedAt</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-[var(--store-bg-1)] px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white"
              >
                {sortOrder === "desc" ? (
                  <>
                    <ArrowUpAZ className="size-4" />
                    ASC
                  </>
                ) : (
                  <>
                    <ArrowDownAZ className="size-4" />
                    DESC
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`grid h-12 w-12 place-items-center rounded-md border transition ${viewMode === "list"
                  ? "border-[#f16d59] bg-[#f16d59] text-white"
                  : "border-gray-300 bg-[var(--store-bg-1)] text-gray-500 hover:text-[#f16d59]"
                  }`}
              >
                <List className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`grid h-12 w-12 place-items-center rounded-md border transition ${viewMode === "grid"
                  ? "border-[#f16d59] bg-[#f16d59] text-white"
                  : "border-gray-300 bg-[var(--store-bg-1)] text-gray-500 hover:text-[#f16d59]"
                  }`}
              >
                <Grid2X2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {productItems.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid grid-cols-1 gap-6"
              }
            >
              {/* check filteredProducts */}

              {products?.items.map((product) => (
                <ProductCard
                  viewMode={viewMode}
                  key={product.id}
                  product={product}
                  theme={theme}
                  dashboardColor={dashboardColor}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[var(--store-bg-1)] px-6 py-16 text-center shadow-sm">
              <h3 className="text-xl font-bold text-gray-950">
                No products found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try another category or clear the category filter.
              </p>

              <button
                type="button"
                onClick={handleClearCategory}
                className="mt-5 rounded-full bg-[#f16d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-950"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FashionProduct;
