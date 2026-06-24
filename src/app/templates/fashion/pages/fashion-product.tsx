"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Grid2X2,
  List,
  Minus,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import { allProducts } from "../_components/productData";
import ProductCard from "../_components/product-card";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import Loader from "@/components/shared/loader";

type ProductProps = {
  categoryId?: string;
};

type Category = {
  id: string;
  businessId?: string;
  parentId: string | null;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  status?: string;
  sortOrder?: number;
};

type CategoryTreeItem = {
  category: Category;
  children: CategoryTreeItem[];
};

const getChildrenIds = (item: CategoryTreeItem): string[] => {
  const childIds = item.children.flatMap((child) => [
    child.category.id,
    ...getChildrenIds(child),
  ]);

  return childIds;
};

const findCategoryById = (
  items: CategoryTreeItem[],
  categoryId?: string,
): CategoryTreeItem | null => {
  if (!categoryId) return null;

  for (const item of items) {
    if (item.category.id === categoryId) {
      return item;
    }

    const found = findCategoryById(item.children, categoryId);

    if (found) {
      return found;
    }
  }

  return null;
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
        className={`flex w-full items-center justify-between py-2 text-left text-sm font-medium transition ${
          isActive ? "text-[#f16d59]" : "text-gray-900 hover:text-[#f16d59]"
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
            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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

const FashionProduct = ({ categoryId }: ProductProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // all categories
  const {data: categories, isLoading, isFetching} = useProductCategoryQuery();

  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");


  const selectedCategory = useMemo(() => {
    return findCategoryById(categories ?? [], categoryId);
  }, [categories, categoryId]);

  const filterCategoryIds = useMemo(() => {
    if (!selectedCategory) return [];

    return [
      selectedCategory.category.id,
      ...getChildrenIds(selectedCategory),
    ];
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (categoryId && filterCategoryIds.length > 0) {
      products = products.filter((product) =>
        filterCategoryIds.includes(product.categoryId),
      );
    }

    if (sortBy === "price-low") {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "price-high") {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }, [categoryId, filterCategoryIds, sortBy]);

  const handleCategoryClick = (id: string) => {
    router.push(`${pathname}?categoryId=${id}`);
  };

  const handleClearCategory = () => {
    router.push(pathname);
  };

  if (isLoading || isFetching) return <Loader />

  return (
    <section className="bg-[#f6f6f6] py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[270px_1fr] lg:px-8">


        {/* Left Sidebar */}
        <aside className="h-fit bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-950">
              Product categories
            </h2>

            <SlidersHorizontal className="h-5 w-5 text-gray-500 lg:hidden" />
          </div>

          <button
            type="button"
            onClick={handleClearCategory}
            className={`mt-5 block w-full text-left text-sm font-medium transition ${
              !categoryId ? "text-[#f16d59]" : "text-gray-900 hover:text-[#f16d59]"
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
          <div className="mb-8 flex flex-col gap-4 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl font-bold text-gray-950 md:text-2xl">
              Total Products Found: {filteredProducts.length}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-lg font-semibold text-gray-950">
                Sort by:
              </label>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-12 w-48 appearance-none rounded-md border border-gray-300 bg-white px-4 pr-10 text-sm text-gray-700 outline-none focus:border-[#f16d59]"
                >
                  <option value="latest">Latest Product</option>
                  <option value="price-low">Price Low to High</option>
                  <option value="price-high">Price High to Low</option>
                  <option value="name">Name A to Z</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`grid h-12 w-12 place-items-center rounded-md border transition ${
                  viewMode === "list"
                    ? "border-[#f16d59] bg-[#f16d59] text-white"
                    : "border-gray-300 bg-white text-gray-500 hover:text-[#f16d59]"
                }`}
              >
                <List className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`grid h-12 w-12 place-items-center rounded-md border transition ${
                  viewMode === "grid"
                    ? "border-[#f16d59] bg-[#f16d59] text-white"
                    : "border-gray-300 bg-white text-gray-500 hover:text-[#f16d59]"
                }`}
              >
                <Grid2X2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Selected Category Text */}
          {selectedCategory && (
            <div className="mb-5 flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
              <p className="text-sm text-gray-600">
                Showing products for:{" "}
                <span className="font-semibold text-[#f16d59]">
                  {selectedCategory.category.name}
                </span>
              </p>

              <button
                type="button"
                onClick={handleClearCategory}
                className="text-sm font-semibold text-gray-900 hover:text-[#f16d59]"
              >
                Clear
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid grid-cols-1 gap-6"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard 
                viewMode={viewMode}
                key={product.id} 
                product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white px-6 py-16 text-center shadow-sm">
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