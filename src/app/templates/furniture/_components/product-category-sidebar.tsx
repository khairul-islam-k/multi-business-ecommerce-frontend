"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

type ProductCategorySidebarProps = {
  categories?: CategoryTreeItem[];
  categoryId?: string;
  handleClearCategory: () => void;
  handleCategoryClick: (categoryId: string) => void;
};

export function ProductCategorySidebar({
  categories,
  categoryId,
  handleClearCategory,
  handleCategoryClick,
}: ProductCategorySidebarProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  return (
    <aside className="hidden h-fit bg-[var(--store-bg-1)] px-2 md:block">
      <div className="border-t border-[#d6d2c9]">
        {/* Categories accordion header */}
        <button
          type="button"
          onClick={() => setCategoriesOpen((previous) => !previous)}
          className="flex w-full items-center justify-between border-b border-[#d6d2c9] py-5 text-left"
          aria-expanded={categoriesOpen}
        >
          <span className="text-[15px] font-semibold text-[var(--store-text-1)]">
            Categories
          </span>

          <ChevronDown
            className={`h-[18px] w-[18px] shrink-0 text-[var(--store-text-1)] transition-transform duration-200 ${
              categoriesOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Categories content */}
        <div
          className={`grid transition-all duration-300 ${
            categoriesOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-b border-[#d6d2c9] py-3">
              <button
                type="button"
                onClick={handleClearCategory}
                className={`block w-full py-2 text-left text-sm font-medium transition-colors ${
                  !categoryId
                    ? "text-[#f16d59]"
                    : "text-[var(--store-text-1)] hover:text-[#f16d59]"
                }`}
              >
                All Products
              </button>

              <div>
                {categories?.map((item) => (
                  <CategorySidebarItem
                    key={item.category.id}
                    item={item}
                    activeCategoryId={categoryId}
                    onCategoryClick={handleCategoryClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const CategorySidebarItem = ({
  item,
  activeCategoryId,
  onCategoryClick,
  level = 0,
}: {
  item: CategoryTreeItem;
  activeCategoryId?: string;
  onCategoryClick: (categoryId: string) => void;
  level?: number;
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children.length > 0;
  const isActive = activeCategoryId === item.category.id;

  return (
    <div>
      <div
        className="flex w-full items-center"
        style={{
          paddingLeft: `${level * 16}px`,
        }}
      >
        <button
          type="button"
          onClick={() => onCategoryClick(item.category.id)}
          className={`min-w-0 flex-1 py-2.5 text-left text-sm font-medium transition-colors ${
            isActive
              ? "text-[#f16d59]"
              : "text-[var(--store-text-1)] hover:text-[#f16d59]"
          }`}
        >
          <span className="block truncate">{item.category.name}</span>
        </button>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            className="grid h-8 w-8 shrink-0 place-items-center text-[var(--store-text-1)] transition-colors hover:text-[#f16d59]"
            aria-label={
              open
                ? `Close ${item.category.name}`
                : `Open ${item.category.name}`
            }
            aria-expanded={open}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <div
          className={`grid transition-all duration-300 ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {item.children.map((child) => (
              <CategorySidebarItem
                key={child.category.id}
                item={child}
                activeCategoryId={activeCategoryId}
                onCategoryClick={onCategoryClick}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};