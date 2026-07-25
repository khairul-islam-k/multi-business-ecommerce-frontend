"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  ChevronDown,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import { useCart } from "@/app/store/_components/contex/CartContex";
import StoreThemeToggle from "@/app/store/_components/store-theme-switcher";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import type { FAQItem } from "@/types/website/website";

import AvatarDropdown from "../../fashion/_components/avatar-dropdown";
import LogoComponent from "../../fashion/_components/logo/logo-component";

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

type NavbarProps = {
  faqs?: FAQItem[];
  privacy?: string;
  terms?: string;
  phone?: string;
};

type FlattenedCategory = {
  item: CategoryTreeItem;
  depth: number;
};

/**
 * Flattens all child categories so every nested category
 * can be displayed inside the desktop dropdown.
 */
const flattenCategoryChildren = (
  items: CategoryTreeItem[],
  depth = 0,
): FlattenedCategory[] => {
  return items.flatMap((item) => [
    {
      item,
      depth,
    },
    ...flattenCategoryChildren(
      item.children,
      depth + 1,
    ),
  ]);
};

type MobileCategoryItemProps = {
  item: CategoryTreeItem;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

const MobileCategoryItem = ({
  item,
  onCategoryClick,
}: MobileCategoryItemProps) => {
  const hasChildren =
    item.children.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="flex w-full items-center border-b border-white/10 px-5 py-4 text-left text-sm font-medium text-white transition hover:bg-white/5 hover:text-white"
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <details className="group border-b border-white/10">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-white transition hover:bg-white/5">
        <span className="min-w-0 truncate">
          {item.category.name}
        </span>

        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="bg-black/20 pb-2">
        <button
          type="button"
          onClick={() =>
            onCategoryClick(item.category.id)
          }
          className="block w-full border-b border-white/5 px-8 py-3 text-left text-sm font-semibold text-white/90 transition hover:bg-white/5 hover:text-white"
        >
          View All {item.category.name}
        </button>

        {item.children.map((child) => (
          <div
            key={child.category.id}
            className="pl-4"
          >
            <MobileCategoryItem
              item={child}
              onCategoryClick={
                onCategoryClick
              }
            />
          </div>
        ))}
      </div>
    </details>
  );
};

const VehicleNavbar = ({
  phone,
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useCart();

  const { data: categories } =
    useProductCategoryQuery();

  const [
    activeDesktopCategoryId,
    setActiveDesktopCategoryId,
  ] = useState<string | null>(null);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const categoryTree =
    useMemo<CategoryTreeItem[]>(
      () =>
        Array.isArray(categories)
          ? (categories as CategoryTreeItem[])
          : [],
      [categories],
    );

  const phoneNumber =
    phone?.trim() || "+880 1234-567890";

  const phoneHref = phoneNumber.replace(
    /[^\d+]/g,
    "",
  );

  const getCategoryHref = (
    categoryId: string,
  ) => {
    return `/store/products?categoryId=${encodeURIComponent(
      categoryId,
    )}`;
  };

  const handleCategoryClick = (
    categoryId: string,
  ) => {
    setMobileMenuOpen(false);
    setActiveDesktopCategoryId(null);

    router.push(
      getCategoryHref(categoryId),
    );
  };

  /**
   * Close menus after route changes.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDesktopCategoryId(null);
  }, [pathname]);

  /**
   * Lock page scroll while mobile category
   * navigation is open.
   */
  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-[80] w-full shadow-sm">
        {/* =========================================
            DESKTOP NAVBAR
        ========================================== */}
        <div className="hidden min-h-[120px] grid-cols-[290px_minmax(0,1fr)] lg:grid">
          {/* Desktop logo section */}
          <div className="row-span-2 flex min-h-[120px] items-center justify-center bg-[#131a25] px-6 py-4">
            <Link
              href="/store"
              aria-label="Go to store home"
              className="flex w-full items-center justify-center [&_img]:h-auto [&_img]:max-h-[82px] [&_img]:w-auto [&_img]:max-w-full [&_img]:brightness-0 [&_img]:invert"
            >
              <LogoComponent
              textColor="white"
              />
            </Link>
          </div>

          {/* Desktop top utility navbar */}
          <div className="flex h-10 items-center justify-end border-b border-black/5 bg-[#e8e8e8] px-5 xl:px-8">
            <div className="flex h-full items-center">
              <a
                href={`tel:${phoneHref}`}
                className="flex h-full items-center gap-2 border-r border-black/15 px-4 text-sm font-semibold text-[#111827] transition hover:bg-black/5"
              >
                <Phone className="size-4" />

                <span>{phoneNumber}</span>
              </a>

              <div className="flex h-full items-center border-r border-black/15 px-4">
                {user ? (
                  <AvatarDropdown />
                ) : (
                  <Link
                    href="/store/login"
                    className="flex items-center gap-2 text-sm font-semibold text-[#111827] transition hover:text-black"
                  >
                    <UserRound className="size-4" />
                    Sign In
                  </Link>
                )}
              </div>

              <div className="flex h-full items-center px-4">
                <StoreThemeToggle />
              </div>
            </div>
          </div>

          {/* Desktop category navbar */}
          <div
            className="relative border-b border-[#dddddd] bg-white"
            onMouseLeave={() =>
              setActiveDesktopCategoryId(
                null,
              )
            }
          >
            <nav
              aria-label="Product categories"
              className="flex min-h-20 flex-wrap items-stretch justify-center px-3 xl:px-6"
            >
              {categoryTree.map((item) => {
                const isOpen =
                  activeDesktopCategoryId ===
                  item.category.id;

                const dropdownCategories =
                  flattenCategoryChildren(
                    item.children,
                  );

                const hasChildren =
                  dropdownCategories.length > 0;

                return (
                  <div
                    key={item.category.id}
                    className="relative flex min-h-20 items-stretch"
                    onMouseEnter={() =>
                      setActiveDesktopCategoryId(
                        item.category.id,
                      )
                    }
                  >
                    <Link
                      href={getCategoryHref(
                        item.category.id,
                      )}
                      onFocus={() =>
                        setActiveDesktopCategoryId(
                          item.category.id,
                        )
                      }
                      onClick={() =>
                        setActiveDesktopCategoryId(
                          null,
                        )
                      }
                      className={`relative flex min-h-20 items-center gap-1.5 px-4 text-sm font-medium uppercase tracking-[0.01em] transition xl:px-5 ${
                        isOpen
                          ? "text-black"
                          : "text-[#111827] hover:text-black"
                      }`}
                    >
                      <span className="whitespace-nowrap">
                        {item.category.name}
                      </span>

                      {hasChildren && (
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-200 ${
                            isOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      )}

                      <span
                        className={`absolute inset-x-4 bottom-0 h-[3px] origin-center bg-[#131a25] transition-transform duration-200 xl:inset-x-5 ${
                          isOpen
                            ? "scale-x-100"
                            : "scale-x-0"
                        }`}
                      />
                    </Link>

                    {/* Desktop dark dropdown */}
                    {isOpen &&
                      hasChildren && (
                        <div className="absolute left-0 top-full z-[100] w-[280px] border-t-4 border-[#131a25] bg-[#151c28] shadow-[0_16px_35px_rgba(0,0,0,0.3)]">
                          <Link
                            href={getCategoryHref(
                              item.category.id,
                            )}
                            onClick={() =>
                              setActiveDesktopCategoryId(
                                null,
                              )
                            }
                            className="block border-b border-white/20 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            All{" "}
                            {item.category.name}
                          </Link>

                          <div className="max-h-[420px] overflow-y-auto">
                            {dropdownCategories.map(
                              ({
                                item:
                                  dropdownItem,
                                depth,
                              }) => (
                                <Link
                                  key={
                                    dropdownItem
                                      .category.id
                                  }
                                  href={getCategoryHref(
                                    dropdownItem
                                      .category.id,
                                  )}
                                  onClick={() =>
                                    setActiveDesktopCategoryId(
                                      null,
                                    )
                                  }
                                  style={{
                                    paddingLeft:
                                      16 +
                                      depth *
                                        14,
                                  }}
                                  className="block border-b border-white/20 py-3.5 pr-4 text-sm text-white transition last:border-b-0 hover:bg-white/10"
                                >
                                  {
                                    dropdownItem
                                      .category
                                      .name
                                  }
                                </Link>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}

              {categoryTree.length ===
                0 && (
                <div className="flex min-h-20 items-center text-sm text-gray-500">
                  No categories found
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* =========================================
            MOBILE NAVBAR
        ========================================== */}
        <div className="lg:hidden">
          {/* Mobile top utility navbar */}
          <div className="flex h-10 items-center justify-between border-b border-black/10 bg-[#e8e8e8] px-3">
            <a
              href={`tel:${phoneHref}`}
              className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-[#111827]"
            >
              <Phone className="size-3.5 shrink-0" />

              <span className="truncate">
                {phoneNumber}
              </span>
            </a>

            <div className="flex h-full shrink-0 items-center">
              <div className="flex h-full items-center border-l border-black/10 px-2.5">
                {user ? (
                  <AvatarDropdown />
                ) : (
                  <Link
                    href="/store/login"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]"
                  >
                    <UserRound className="size-3.5" />
                    Sign In
                  </Link>
                )}
              </div>

              <div className="flex h-full items-center border-l border-black/10 pl-2.5">
                <StoreThemeToggle />
              </div>
            </div>
          </div>

          {/* Mobile black logo and menu navbar */}
          <div className="flex h-16 items-center justify-between bg-[#131a25] px-4">
            <Link
              href="/store"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              aria-label="Go to store home"
              className="flex min-w-0 items-center [&_img]:h-auto [&_img]:max-h-11 [&_img]:w-auto [&_img]:max-w-[190px] [&_img]:brightness-0 [&_img]:invert"
            >
              <LogoComponent 
              textColor="white"
              />
            </Link>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (previous) => !previous,
                )
              }
              aria-label={
                mobileMenuOpen
                  ? "Close category menu"
                  : "Open category menu"
              }
              aria-expanded={
                mobileMenuOpen
              }
              className="grid size-11 shrink-0 place-items-center border border-white/20 text-white transition hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop dropdown background */}
      {activeDesktopCategoryId && (
        <button
          type="button"
          aria-label="Close category menu"
          onClick={() =>
            setActiveDesktopCategoryId(null)
          }
          className="fixed inset-0 z-[70] hidden bg-black/20 lg:block"
        />
      )}

      {/* Mobile menu overlay */}
      <button
        type="button"
        aria-label="Close mobile category menu"
        onClick={() =>
          setMobileMenuOpen(false)
        }
        className={`fixed inset-x-0 bottom-0 top-[104px] z-[90] bg-black/60 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* Mobile category drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Product categories"
        aria-hidden={!mobileMenuOpen}
        className={`fixed bottom-0 right-0 top-[104px] z-[100] flex w-[88%] max-w-sm flex-col bg-[#131a25] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">
              Navigation
            </p>

            <h2 className="mt-0.5 text-lg font-semibold text-white">
              Categories
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            aria-label="Close categories"
            className="grid size-10 place-items-center border border-white/20 text-white transition hover:bg-white/10"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto">
          {categoryTree.length > 0 ? (
            categoryTree.map((item) => (
              <MobileCategoryItem
                key={item.category.id}
                item={item}
                onCategoryClick={
                  handleCategoryClick
                }
              />
            ))
          ) : (
            <p className="px-5 py-10 text-center text-sm text-white/60">
              No categories found.
            </p>
          )}
        </nav>
      </aside>
    </>
  );
};

export default VehicleNavbar;