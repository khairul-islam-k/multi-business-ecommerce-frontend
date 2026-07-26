"use client";
import { useProductCategoryQuery } from '@/lib/api/hooks/public-website';
import { List, Minus, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

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
//   activeCategoryId?: string;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

const CategorySidebarItem = ({
  item,
//   activeCategoryId,
  onCategoryClick,
}: CategorySidebarItemProps) => {
  const [open, setOpen] = useState(false);

  const hasChildren =
    item.children.length > 0;

  const isActive = false;

  return (
    <div>
      <div
        className={`flex items-center rounded-lg transition ${
          isActive
            ? "bg-[var(--store-bg-2)]"
            : "hover:bg-[var(--store-bg-2)]"
        }`}
      >
        <button
          type="button"
          onClick={() =>
            onCategoryClick(item.category.id)
          }
          className={`min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm font-medium transition ${
            isActive
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

const BannerSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const {
        data: categories,
        isLoading: categoriesLoading,
        isFetching: categoriesFetching,
    } = useProductCategoryQuery();

    // handle category
    const handleCategoryClick = (
        id: string,
    ) => {
        const params = new URLSearchParams();

        params.set("categoryId", id);

        // if (search?.trim()) {
        //     params.set("search", search.trim());
        // }

        router.push(
            `${pathname}?${params.toString()}`,
        );
    };

    const handleClearCategory = () => {
        const params = new URLSearchParams();

        // if (search?.trim()) {
        //     params.set("search", search.trim());
        // }

        const query = params.toString();

        router.push(
            query ? `${pathname}?${query}` : pathname,
        );
    };

    return (
        <div>
            <aside className="hidden h-fit rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] p-5 shadow-sm lg:sticky lg:top-24 lg:block">
                {/* Sidebar heading */}
                <div className="border-b border-[var(--store-border)] pb-4">
                    <h2 className="text-lg font-bold text-[var(--store-text-primary)]">
                        Product Filters
                    </h2>

                </div>

                {/* Categories */}
                <div className="border-b border-[var(--store-border)] py-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--store-text-primary)]">
                        Categories
                    </h3>

                    <button
                        type="button"
                        onClick={handleClearCategory}
                        className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition bg-[var(--store-bg-2)] text-[var(--store-primary)]`}
                
                    >
                        All Products
                    </button>

                    <div className="mt-1 space-y-1">
                        {categories?.map((item) => (
                            <CategorySidebarItem
                                key={item.category.id}
                                item={item}
                                // activeCategoryId={categoryId}
                                onCategoryClick={
                                    handleCategoryClick
                                }
                            />
                        ))}
                    </div>
                </div>

            </aside>
        </div>
    );
};

export default BannerSidebar;