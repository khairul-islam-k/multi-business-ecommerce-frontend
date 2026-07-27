"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";

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
  const [open, setOpen] =
    useState(false);

  const hasChildren =
    (item.children?.length ?? 0) > 0;

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
            onCategoryClick(
              item.category.id,
            )
          }
          title={item.category.name}
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
              setOpen(
                (previous) => !previous,
              )
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
          {item.children.map(
            (child) => (
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
            ),
          )}
        </div>
      )}
    </div>
  );
};

const BannerSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  const activeCategoryId =
    searchParams.get("categoryId") ??
    undefined;

  const {
    data: categories,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useProductCategoryQuery();

  const handleCategoryClick = (
    categoryId: string,
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.set(
      "categoryId",
      categoryId,
    );

    router.push(
      `${pathname}/products?${params.toString()}`,
    );
  };

  const handleClearCategory = () => {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.delete("categoryId");

    const query = params.toString();

    router.push(
      query
        ? `${pathname}?${query}`
        : pathname,
    );
  };

  const isCategoryLoading =
    categoriesLoading ||
    categoriesFetching;

  return (
    <div>
      <aside className="hidden h-[450px] flex-col overflow-hidden border border-[var(--store-border)] p-5 shadow-sm lg:sticky lg:top-24 lg:flex">
        {/* Fixed heading */}
        <div className="shrink-0 border-b border-[var(--store-border)] pb-4">
          <h2 className="text-lg font-bold text-[var(--store-text-primary)]">
            Product Filters
          </h2>
        </div>

        {/* Only this section will scroll */}
        <div className="min-h-0 flex-1 overflow-y-auto py-5 pr-2">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--store-text-primary)]">
            Categories
          </h3>

          <button
            type="button"
            onClick={handleClearCategory}
            className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${!activeCategoryId
                ? "bg-[var(--store-bg-2)] text-[var(--store-primary)]"
                : "text-[var(--store-text-primary)] hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
              }`}
          >
            All Products
          </button>

          <div className="mt-1 space-y-1">
            {isCategoryLoading ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-10 animate-pulse rounded-lg bg-[var(--store-bg-2)]"
                    />
                  ),
                )}
              </div>
            ) : categories?.length ? (
              categories.map((item) => (
                <CategorySidebarItem
                  key={item.category.id}
                  item={item}
                  activeCategoryId={
                    activeCategoryId
                  }
                  onCategoryClick={
                    handleCategoryClick
                  }
                />
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-[var(--store-muted)]">
                No categories found.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default BannerSidebar;