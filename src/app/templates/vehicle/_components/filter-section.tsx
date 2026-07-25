"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useProductBrands,
  useProductCategoryQuery,
} from "@/lib/api/hooks/public-website";
import type {
  StorefrontCategory,
  StorefrontCategoryTreeItem,
} from "@/types/template/public-website";

type ProductBrand = {
  id: string;
  businessId?: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  status?: string;
};

function flattenCategoryTree(
  tree: StorefrontCategoryTreeItem[],
): StorefrontCategory[] {
  const result: StorefrontCategory[] = [];

  const walk = (
    items: StorefrontCategoryTreeItem[],
  ) => {
    items.forEach((item) => {
      if (item.category) {
        result.push(item.category);
      }

      if (item.children?.length) {
        walk(item.children);
      }
    });
  };

  walk(tree);

  return result;
}

function removeDuplicateCategories(
  categories: StorefrontCategory[],
): StorefrontCategory[] {
  return Array.from(
    new Map(
      categories.map((category) => [
        category.id,
        category,
      ]),
    ).values(),
  );
}

function removeDuplicateBrands(
  brands: ProductBrand[],
): ProductBrand[] {
  return Array.from(
    new Map(
      brands.map((brand) => [
        brand.id,
        brand,
      ]),
    ).values(),
  );
}

const FilterSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") ?? "";

  const currentCategoryId =
    searchParams.get("categoryId") ?? "";

  const currentBrandId =
    searchParams.get("brandId") ?? "";

  const [searchValue, setSearchValue] =
    useState(currentSearch);

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState(currentCategoryId);

  const [
    selectedBrandId,
    setSelectedBrandId,
  ] = useState(currentBrandId);

  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    isFetching: isBrandsFetching,
  } = useProductBrands();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useProductCategoryQuery();

  const categories = useMemo(() => {
    const categoryTree = Array.isArray(
      categoriesData,
    )
      ? categoriesData
      : [];

    const flattenedCategories =
      flattenCategoryTree(categoryTree);

    return removeDuplicateCategories(
      flattenedCategories,
    ).sort((firstCategory, secondCategory) =>
      firstCategory.name.localeCompare(
        secondCategory.name,
      ),
    );
  }, [categoriesData]);

  const brands = useMemo<ProductBrand[]>(
    () => {
      const brandList = Array.isArray(
        brandsData,
      )
        ? (brandsData as ProductBrand[])
        : [];

      return removeDuplicateBrands(
        brandList,
      ).sort((firstBrand, secondBrand) =>
        firstBrand.name.localeCompare(
          secondBrand.name,
        ),
      );
    },
    [brandsData],
  );

  const isLoading =
    isBrandsLoading ||
    isCategoriesLoading;

  const isFetching =
    isBrandsFetching ||
    isCategoriesFetching;

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentCategoryId ||
      currentBrandId,
  );

  /**
   * Keep local fields synchronized with URL filters.
   * This is useful when the user uses browser back/forward.
   */
  useEffect(() => {
    setSearchValue(currentSearch);
    setSelectedCategoryId(
      currentCategoryId,
    );
    setSelectedBrandId(currentBrandId);
  }, [
    currentBrandId,
    currentCategoryId,
    currentSearch,
  ]);

  const updateFilters = () => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    const normalizedSearch =
      searchValue.trim();

    if (normalizedSearch) {
      params.set(
        "search",
        normalizedSearch,
      );
    } else {
      params.delete("search");
    }

    if (selectedCategoryId) {
      params.set(
        "categoryId",
        selectedCategoryId,
      );
    } else {
      params.delete("categoryId");
    }

    if (selectedBrandId) {
      params.set(
        "brandId",
        selectedBrandId,
      );
    } else {
      params.delete("brandId");
    }

    /*
     * Reset pagination whenever filters change.
     * Change "page" if your API uses another key.
     */
    params.delete("page");

    const queryString = params.toString();

    router.push(
      queryString
        ? `${pathname}/products?${queryString}`
        : pathname,
      {
        scroll: false,
      },
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    updateFilters();
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSelectedCategoryId("");
    setSelectedBrandId("");

    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("search");
    params.delete("categoryId");
    params.delete("brandId");
    params.delete("page");

    const queryString = params.toString();

    router.push(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      },
    );
  };

  return (
    <section className="w-full relative -top-11 z-50 px-4 md:px-5">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8
        border-[var(--store-border)] bg-[var(--store-bg-3)] rounded-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center bg-[#151c28] text-white">
              <SlidersHorizontal className="size-4" />
            </span>

            <div>
              <h2 className="text-base font-semibold text-[var(--store-text-primary)]">
                Find Your Vehicle
              </h2>
            </div>
          </div>

          {isFetching && !isLoading && (
            <span className="text-xs text-[var(--store-text-secondary)]">
              Updating...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1.5fr)_minmax(190px,1fr)_minmax(190px,1fr)_auto_auto]">
          {/* Search field */}
          <div className="relative">
            <label
              htmlFor="vehicle-search"
              className="sr-only"
            >
              Search vehicles
            </label>

            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

            <input
              id="vehicle-search"
              type="search"
              value={searchValue}
              onChange={(event) =>
                setSearchValue(
                  event.target.value,
                )
              }
              placeholder="Search vehicle..."
              autoComplete="off"
              className="h-12 w-full border border-[var(--store-border)] bg-[var(--store-bg-1)] pl-11 pr-4 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-gray-400 focus:border-[#151c28] focus:ring-1 focus:ring-[#151c28]"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <label
              htmlFor="vehicle-category"
              className="sr-only"
            >
              Select category
            </label>

            <select
              id="vehicle-category"
              value={selectedCategoryId}
              onChange={(event) =>
                setSelectedCategoryId(
                  event.target.value,
                )
              }
              disabled={
                isCategoriesLoading
              }
              className="h-12 w-full cursor-pointer appearance-none border border-[var(--store-border)] bg-[var(--store-bg-1)] px-4 pr-10 text-sm text-[var(--store-text-primary)] outline-none transition focus:border-[#151c28] focus:ring-1 focus:ring-[#151c28] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {isCategoriesLoading
                  ? "Loading categories..."
                  : "All Categories"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ),
              )}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              ▼
            </span>
          </div>

          {/* Brand filter */}
          <div className="relative">
            <label
              htmlFor="vehicle-brand"
              className="sr-only"
            >
              Select brand
            </label>

            <select
              id="vehicle-brand"
              value={selectedBrandId}
              onChange={(event) =>
                setSelectedBrandId(
                  event.target.value,
                )
              }
              disabled={isBrandsLoading}
              className="h-12 w-full cursor-pointer appearance-none border border-[var(--store-border)] bg-[var(--store-bg-1)] px-4 pr-10 text-sm text-[var(--store-text-primary)] outline-none transition focus:border-[#151c28] focus:ring-1 focus:ring-[#151c28] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {isBrandsLoading
                  ? "Loading brands..."
                  : "All Brands"}
              </option>

              {brands.map((brand) => (
                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              ▼
            </span>
          </div>

          {/* Apply button */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 items-center justify-center gap-2 bg-[#151c28] px-6 text-sm font-semibold text-white transition hover:bg-[#202a39] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="size-4" />

            {isLoading
              ? "Loading..."
              : "Search"}
          </button>

          {/* Clear button */}
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={
              !hasActiveFilters &&
              !searchValue &&
              !selectedCategoryId &&
              !selectedBrandId
            }
            className="inline-flex h-12 items-center justify-center gap-2 border border-[var(--store-border)] bg-[var(--store-bg-1)] px-5 text-sm font-medium text-[var(--store-text-primary)] transition hover:border-[#151c28] hover:bg-[var(--store-bg-2)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="size-4" />
            Clear
          </button>
        </div>

        {/* Current filter summary */}
        {(currentSearch ||
          currentCategoryId ||
          currentBrandId) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--store-text-secondary)]">
              Active filters:
            </span>

            {currentSearch && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");

                  const params =
                    new URLSearchParams(
                      searchParams.toString(),
                    );

                  params.delete("search");
                  params.delete("page");

                  router.push(
                    params.toString()
                      ? `${pathname}?${params.toString()}`
                      : pathname,
                    {
                      scroll: false,
                    },
                  );
                }}
                className="inline-flex items-center gap-2 bg-[var(--store-bg-2)] px-3 py-1.5 text-xs text-[var(--store-text-primary)]"
              >
                Search: {currentSearch}
                <span aria-hidden="true">×</span>
              </button>
            )}

            {currentCategoryId && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId("");

                  const params =
                    new URLSearchParams(
                      searchParams.toString(),
                    );

                  params.delete(
                    "categoryId",
                  );
                  params.delete("page");

                  router.push(
                    params.toString()
                      ? `${pathname}?${params.toString()}`
                      : pathname,
                    {
                      scroll: false,
                    },
                  );
                }}
                className="inline-flex items-center gap-2 bg-[var(--store-bg-2)] px-3 py-1.5 text-xs text-[var(--store-text-primary)]"
              >
                Category:{" "}
                {categories.find(
                  (category) =>
                    category.id ===
                    currentCategoryId,
                )?.name ?? "Selected"}
                <span aria-hidden="true">×</span>
              </button>
            )}

            {currentBrandId && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBrandId("");

                  const params =
                    new URLSearchParams(
                      searchParams.toString(),
                    );

                  params.delete("brandId");
                  params.delete("page");

                  router.push(
                    params.toString()
                      ? `${pathname}?${params.toString()}`
                      : pathname,
                    {
                      scroll: false,
                    },
                  );
                }}
                className="inline-flex items-center gap-2 bg-[var(--store-bg-2)] px-3 py-1.5 text-xs text-[var(--store-text-primary)]"
              >
                Brand:{" "}
                {brands.find(
                  (brand) =>
                    brand.id ===
                    currentBrandId,
                )?.name ?? "Selected"}
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  );
};

export default FilterSection;