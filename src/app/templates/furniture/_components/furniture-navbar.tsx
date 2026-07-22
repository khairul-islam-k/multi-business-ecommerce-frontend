"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Armchair,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useCart } from "@/app/store/_components/contex/CartContex";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import {
  useProductCategoryQuery,
} from "@/lib/api/hooks/public-website";
import { useTemplateProductWishListQuery } from "@/lib/api/hooks/template-product-wishList";
import type { FAQItem } from "@/types/website/website";

import AvatarDropdown from "../../fashion/_components/avatar-dropdown";
import LogoComponent from "../../fashion/_components/logo/logo-component";
import SearchField from "../../grocery/_components/search-field";
import StoreThemeToggle from "@/app/store/_components/store-theme-switcher";
// import SearchField from "./search-field";

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

type StaticNavigationItem = {
  label: string;
  href: string;
};

const topNavigationItems: StaticNavigationItem[] = [
  {
    label: "Showroom",
    href: "/store/products",
  }
];

const endingNavigationItems: StaticNavigationItem[] = [
  {
    label: "Brands",
    href: "/store/brands",
  },
  {
    label: "Shop",
    href: "/store/products",
  },
  {
    label: "Promotions",
    href: "/store/products?inOffer=true",
  },
];

const flattenCategoryTree = (
  item: CategoryTreeItem,
): CategoryTreeItem[] => {
  return [
    item,
    ...item.children.flatMap((child) =>
      flattenCategoryTree(child),
    ),
  ];
};

const MobileCategoryItem = ({
  item,
  onCategoryClick,
}: {
  item: CategoryTreeItem;
  onCategoryClick: (categoryId: string) => void;
}) => {
  const hasChildren = item.children.length > 0;
  const categoryImage = item.category.imageUrl?.trim();

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="flex w-full items-center gap-3 border-b border-[var(--store-border)] px-1 py-4 text-left text-sm font-medium text-[var(--store-text-primary)] transition hover:text-[var(--store-primary)]"
      >
        {categoryImage ? (
          <span className="relative block size-12 shrink-0 overflow-hidden bg-[var(--store-bg-2)]">
            <Image
              src={imageUrlSet(categoryImage)}
              alt={item.category.name}
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </span>
        ) : (
          <span className="grid size-12 shrink-0 place-items-center bg-[var(--store-bg-2)]">
            <Armchair className="size-5 text-gray-400" />
          </span>
        )}

        <span>{item.category.name}</span>
      </button>
    );
  }

  return (
    <details className="group border-b border-[var(--store-border)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium text-[var(--store-text-primary)]">
        <span className="flex min-w-0 items-center gap-3">
          {categoryImage ? (
            <span className="relative block size-12 shrink-0 overflow-hidden bg-[var(--store-bg-2)]">
              <Image
                src={imageUrlSet(categoryImage)}
                alt={item.category.name}
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </span>
          ) : (
            <span className="grid size-12 shrink-0 place-items-center bg-[var(--store-bg-2)]">
              <Armchair className="size-5 text-gray-400" />
            </span>
          )}

          <span className="truncate">
            {item.category.name}
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="pb-4 pl-5">
        <button
          type="button"
          onClick={() =>
            onCategoryClick(item.category.id)
          }
          className="block w-full border-l border-[var(--store-border)] px-4 py-2 text-left text-sm font-semibold text-[var(--store-primary)]"
        >
          View All {item.category.name}
        </button>

        {item.children.map((child) => (
          <div
            key={child.category.id}
            className="border-l border-[var(--store-border)] px-4"
          >
            <MobileCategoryItem
              item={child}
              onCategoryClick={onCategoryClick}
            />
          </div>
        ))}
      </div>
    </details>
  );
};

const FurnitureNavbar = ({
  phone,
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const desktopSearchRef =
    useRef<HTMLDivElement>(null);

  const [desktopSearchOpen, setDesktopSearchOpen] =
    useState(false);

  const [
    activeDesktopCategoryId,
    setActiveDesktopCategoryId,
  ] = useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const { user } = useCart();

  const { data: categories } =
    useProductCategoryQuery();

  const { data: cart } = useAddActiveCArt();

  const { data: wishList } =
    useTemplateProductWishListQuery();

  const cartCount = cart?.items?.length ?? 0;
  const favoriteCount =
    wishList?.meta?.total ?? 0;

  const phoneNumber =
    phone?.trim() || "+880 1234-567890";

  const phoneHref = phoneNumber.replace(
    /[^\d+]/g,
    "",
  );

  const categoryTree = useMemo<CategoryTreeItem[]>(
    () =>
      Array.isArray(categories)
        ? (categories as CategoryTreeItem[])
        : [],
    [categories],
  );

  /**
   * Limit category names in the desktop navigation
   * so the navbar does not overflow.
   */
  const desktopNavigationCategories = useMemo(
    () => categoryTree.slice(0, 7),
    [categoryTree],
  );

  const activeDesktopCategory = useMemo(
    () =>
      categoryTree.find(
        (item) =>
          item.category.id ===
          activeDesktopCategoryId,
      ) ?? null,
    [activeDesktopCategoryId, categoryTree],
  );

  /**
   * Each direct child becomes one mega-menu column.
   */
  const megaMenuColumns = useMemo(() => {
    if (!activeDesktopCategory) {
      return [];
    }

    if (
      activeDesktopCategory.children.length > 0
    ) {
      return activeDesktopCategory.children.slice(
        0,
        4,
      );
    }

    return [activeDesktopCategory];
  }, [activeDesktopCategory]);

  /**
   * Find two category images for the promotional
   * cards on the right side.
   */
  const promotionalCategories = useMemo(() => {
    if (!activeDesktopCategory) {
      return [];
    }

    return flattenCategoryTree(
      activeDesktopCategory,
    )
      .filter(
        (item) =>
          typeof item.category.imageUrl ===
            "string" &&
          item.category.imageUrl.trim().length > 0,
      )
      .slice(0, 2);
  }, [activeDesktopCategory]);

  const isHomeActive = pathname === "/store";

  const isProductsActive =
    pathname === "/store/products" ||
    pathname.startsWith("/store/products/");

  const isWishlistActive =
    pathname.startsWith(
      "/store/dashboard/wishlist",
    );

  const isCartActive = pathname.startsWith(
    "/store/dashboard/active-cart",
  );

  const isAccountActive =
    pathname.startsWith("/store/dashboard") ||
    pathname.startsWith("/store/login");

  /**
   * Close navigation overlays when the route changes.
   */
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopSearchOpen(false);
    setActiveDesktopCategoryId(null);
  }, [pathname]);

  /**
   * Close desktop search when clicking outside.
   */
  useEffect(() => {
    if (!desktopSearchOpen) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target = event.target as Node;

      if (
        !desktopSearchRef.current?.contains(target)
      ) {
        setDesktopSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [desktopSearchOpen]);

  /**
   * Lock page scrolling while the mobile menu is open.
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

    document.body.style.overflow = "hidden";

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

    router.push(getCategoryHref(categoryId));
  };

  const handleDesktopCategoryEnter = (
    categoryId: string,
  ) => {
    setDesktopSearchOpen(false);
    setActiveDesktopCategoryId(categoryId);
  };

  const handleStaticNavigationEnter = () => {
    setActiveDesktopCategoryId(null);
  };

  return (
    <>
      <header className="sticky top-0 z-[60] bg-[var(--store-bg-1)]">
        {/* Desktop top navigation */}
        <div className="hidden border-b border-[var(--store-border)] lg:block">
          <div className="mx-auto grid h-[50px] w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 xl:px-6">
            {/* Top-left links */}
            <div className="flex items-center gap-8">
              {topNavigationItems.map(
                (navigationItem, index) => (
                  <Link
                    key={navigationItem.label}
                    href={navigationItem.href}
                    className="flex items-center gap-2 text-sm text-[var(--store-text-primary)] transition hover:text-[var(--store-primary)]"
                  >
                    {index === 2 && (
                      <Armchair className="size-4" />
                    )}

                    {navigationItem.label}
                  </Link>
                ),
              )}
            </div>

            {/* Center logo */}
            <div className="flex items-center justify-center">
              <LogoComponent />
            </div>

            {/* Top-right actions */}
            <div className="flex items-center justify-end gap-5">

                <StoreThemeToggle />

              <div
                ref={desktopSearchRef}
                className="relative"
              >

                <button
                  type="button"
                  onClick={() => {
                    setActiveDesktopCategoryId(null);

                    setDesktopSearchOpen(
                      (previous) => !previous,
                    );
                  }}
                  aria-expanded={desktopSearchOpen}
                  aria-label="Search products"
                  className="flex items-center gap-2 text-sm text-[var(--store-text-primary)] transition hover:text-[var(--store-primary)]"
                >
                  <Search className="size-5" />
                  <span>Search</span>
                </button>

                {desktopSearchOpen && (
                  <div className="absolute right-0 top-full z-[90] mt-4 w-[380px] border border-[var(--store-border)] bg-[var(--store-bg-1)] p-3 shadow-xl">
                    <SearchField />
                  </div>
                )}
              </div>

              {user ? (
                <AvatarDropdown />
              ) : (
                <Link
                  href="/store/login"
                  aria-label="Login"
                  className={`transition hover:text-[var(--store-primary)] ${
                    isAccountActive
                      ? "text-[var(--store-primary)]"
                      : "text-[var(--store-text-primary)]"
                  }`}
                >
                  <UserRound className="size-5" />
                </Link>
              )}

              <Link
                href="/store/dashboard/wishlist"
                aria-label="Wishlist"
                className={`relative transition hover:text-[var(--store-primary)] ${
                  isWishlistActive
                    ? "text-[var(--store-primary)]"
                    : "text-[var(--store-text-primary)]"
                }`}
              >
                <Heart className="size-5" />

                {favoriteCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                    {favoriteCount > 9
                      ? "9+"
                      : favoriteCount}
                  </span>
                )}
              </Link>

              <Link
                href="/store/dashboard/active-cart"
                aria-label="Shopping cart"
                className={`relative transition hover:text-[var(--store-primary)] ${
                  isCartActive
                    ? "text-[var(--store-primary)]"
                    : "text-[var(--store-text-primary)]"
                }`}
              >
                <ShoppingBag className="size-5" />

                {cartCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              
            </div>
          </div>
        </div>

        {/* Desktop category navigation and mega menu */}
        <div
          className="relative hidden lg:block"
          onMouseLeave={() =>
            setActiveDesktopCategoryId(null)
          }
        >
          <nav className="border-b border-[var(--store-border)]">
            <div className="mx-auto flex h-[50px] max-w-[1440px] items-center justify-center gap-8 px-4 xl:gap-10 xl:px-6">
              <Link
                href="/store"
                onMouseEnter={
                  handleStaticNavigationEnter
                }
                onFocus={handleStaticNavigationEnter}
                className={`text-sm transition hover:text-[var(--store-primary)] ${
                  isHomeActive
                    ? "text-[var(--store-primary)]"
                    : "text-[var(--store-text-primary)]"
                }`}
              >
                Home
              </Link>

              {desktopNavigationCategories.map(
                (item) => {
                  const isOpen =
                    activeDesktopCategoryId ===
                    item.category.id;

                  return (
                    <Link
                      key={item.category.id}
                      href={getCategoryHref(
                        item.category.id,
                      )}
                      onMouseEnter={() =>
                        handleDesktopCategoryEnter(
                          item.category.id,
                        )
                      }
                      onFocus={() =>
                        handleDesktopCategoryEnter(
                          item.category.id,
                        )
                      }
                      onClick={() =>
                        setActiveDesktopCategoryId(
                          null,
                        )
                      }
                      className={`relative flex h-full items-center text-sm transition ${
                        isOpen
                          ? "text-[var(--store-primary)]"
                          : "text-[var(--store-text-primary)] hover:text-[var(--store-primary)]"
                      }`}
                    >
                      {item.category.name}

                      <span
                        className={`absolute inset-x-0 bottom-0 h-px origin-center bg-[var(--store-primary)] transition-transform duration-200 ${
                          isOpen
                            ? "scale-x-100"
                            : "scale-x-0"
                        }`}
                      />
                    </Link>
                  );
                },
              )}

              {/* {endingNavigationItems.map(
                (navigationItem) => (
                  <Link
                    key={navigationItem.label}
                    href={navigationItem.href}
                    onMouseEnter={
                      handleStaticNavigationEnter
                    }
                    onFocus={
                      handleStaticNavigationEnter
                    }
                    className={`text-sm transition hover:text-[var(--store-primary)] ${
                      navigationItem.label ===
                        "Shop" &&
                      isProductsActive
                        ? "text-[var(--store-primary)]"
                        : "text-[var(--store-text-primary)]"
                    }`}
                  >
                    {navigationItem.label}
                  </Link>
                ),
              )} */}
            </div>
          </nav>

          {/* Hover mega menu */}
          {activeDesktopCategory && (
            <div className="absolute inset-x-0 top-full z-[80] border-b border-[var(--store-border)] bg-[var(--store-bg-1)] shadow-[0_20px_35px_rgba(0,0,0,0.08)]">
              <div className="mx-auto grid max-h-[calc(100vh-130px)] max-w-[1440px] grid-cols-[minmax(0,1fr)_400px] gap-12 overflow-y-auto px-4 py-10 xl:px-6">
                {/* Category columns */}
                <div className="grid grid-cols-2 gap-x-7 gap-y-10 xl:grid-cols-4">
                  {megaMenuColumns.map((column) => {
                    const columnImage =
                      column.category.imageUrl?.trim();

                    return (
                      <div
                        key={column.category.id}
                        className="min-w-0"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleCategoryClick(
                              column.category.id,
                            )
                          }
                          className="flex w-full items-center gap-3 text-left"
                        >
                          {columnImage ? (
                            <span className="relative block h-16 w-20 shrink-0 overflow-hidden">
                              <Image
                                src={imageUrlSet(
                                  columnImage,
                                )}
                                alt={
                                  column.category.name
                                }
                                fill
                                sizes="80px"
                                className="object-contain"
                              />
                            </span>
                          ) : (
                            <span className="grid h-16 w-20 shrink-0 place-items-center bg-[var(--store-bg-2)]">
                              <Armchair className="size-6 text-gray-400" />
                            </span>
                          )}

                          <span className="line-clamp-2 text-xl font-medium text-[var(--store-text-primary)]">
                            {column.category.name}
                          </span>
                        </button>

                        <div className="mt-4 border-t border-[var(--store-border)] pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleCategoryClick(
                                column.category.id,
                              )
                            }
                            className="mb-4 block text-sm font-medium text-[var(--store-text-primary)] transition hover:text-[var(--store-primary)]"
                          >
                            View All
                          </button>

                          <div className="space-y-4">
                            {column.children
                              .slice(0, 6)
                              .map((child) => (
                                <button
                                  key={
                                    child.category.id
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleCategoryClick(
                                      child.category.id,
                                    )
                                  }
                                  className="block w-full text-left text-sm text-[var(--store-text-primary)] transition hover:text-[var(--store-primary)]"
                                >
                                  {
                                    child.category
                                      .name
                                  }
                                </button>
                              ))}

                            {column.children.length ===
                              0 && (
                              <p className="text-sm text-gray-400">
                                Browse available
                                products
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promotional images */}
                <div className="grid grid-cols-2 gap-3">
                  {promotionalCategories.length >
                  0 ? (
                    promotionalCategories.map(
                      (promotionalItem, index) => (
                        <button
                          key={
                            promotionalItem.category.id
                          }
                          type="button"
                          onClick={() =>
                            handleCategoryClick(
                              promotionalItem.category
                                .id,
                            )
                          }
                          className="group text-left"
                        >
                          <div className="relative aspect-[1/1.05] overflow-hidden bg-[var(--store-bg-2)]">
                            <Image
                              src={imageUrlSet(
                                promotionalItem.category
                                  .imageUrl!,
                              )}
                              alt={
                                promotionalItem.category
                                  .name
                              }
                              fill
                              sizes="200px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          <p className="mt-4 flex items-center gap-2 text-sm font-medium uppercase text-[var(--store-text-primary)]">
                            <span className="size-1.5 rounded-full bg-current" />

                            {index === 0
                              ? "On Sale Now"
                              : "New In"}
                          </p>
                        </button>
                      ),
                    )
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleCategoryClick(
                            activeDesktopCategory
                              .category.id,
                          )
                        }
                        className="group text-left"
                      >
                        <div className="grid aspect-[1/1.05] place-items-center overflow-hidden bg-[var(--store-bg-2)]">
                          <Armchair className="size-14 text-gray-300 transition-transform group-hover:scale-110" />
                        </div>

                        <p className="mt-4 flex items-center gap-2 text-sm font-medium uppercase text-[var(--store-text-primary)]">
                          <span className="size-1.5 rounded-full bg-current" />
                          On Sale Now
                        </p>
                      </button>

                      <Link
                        href="/store/products"
                        className="group text-left"
                      >
                        <div className="grid aspect-[1/1.05] place-items-center overflow-hidden bg-[var(--store-bg-2)]">
                          <ShoppingBag className="size-14 text-gray-300 transition-transform group-hover:scale-110" />
                        </div>

                        <p className="mt-4 flex items-center gap-2 text-sm font-medium uppercase text-[var(--store-text-primary)]">
                          <span className="size-1.5 rounded-full bg-current" />
                          New In
                        </p>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu bar */}
        <div className="border-b border-[var(--store-border)] lg:hidden">
          <div className="grid h-16 grid-cols-[44px_1fr_44px] items-center px-4">
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              aria-label="Open category menu"
              aria-expanded={mobileMenuOpen}
              className="grid size-11 place-items-center text-[var(--store-text-primary)]"
            >
              <Menu className="size-6" />
            </button>

            <div className="flex items-center justify-center">
              <LogoComponent />
            </div>

            <Link
              href="/store/dashboard/active-cart"
              aria-label="Shopping cart"
              className="relative grid size-11 place-items-center text-[var(--store-text-primary)]"
            >
              <ShoppingBag className="size-5" />

              {cartCount > 0 && (
                <span className="absolute right-0 top-1 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop mega-menu background overlay */}
      {activeDesktopCategory && (
        <button
          type="button"
          aria-label="Close category navigation"
          onClick={() =>
            setActiveDesktopCategoryId(null)
          }
          className="fixed inset-0 z-50 hidden bg-black/10 lg:block"
        />
      )}

      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close mobile navigation"
        onClick={() =>
          setMobileMenuOpen(false)
        }
        className={`fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* Mobile category drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Store navigation"
        aria-hidden={!mobileMenuOpen}
        className={`fixed left-0 top-0 z-[100] flex h-dvh w-[88%] max-w-sm flex-col bg-[var(--store-bg-1)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--store-border)] px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <LogoComponent />

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full bg-[var(--store-bg-2)] text-[var(--store-text-primary)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Mobile search */}
          <div className="border-b border-[var(--store-border)] p-4">
            <SearchField />
          </div>

          {/* Mobile primary links */}
          <div className="border-b border-[var(--store-border)] px-5 py-5">
            <nav className="space-y-4">
              <Link
                href="/store"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`block text-sm font-medium ${
                  isHomeActive
                    ? "text-[var(--store-primary)]"
                    : "text-[var(--store-text-primary)]"
                }`}
              >
                Home
              </Link>

              {topNavigationItems.map(
                (navigationItem) => (
                  <Link
                    key={navigationItem.label}
                    href={navigationItem.href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="block text-sm font-medium text-[var(--store-text-primary)]"
                  >
                    {navigationItem.label}
                  </Link>
                ),
              )}

              {/* {endingNavigationItems.map(
                (navigationItem) => (
                  <Link
                    key={navigationItem.label}
                    href={navigationItem.href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="block text-sm font-medium text-[var(--store-text-primary)]"
                  >
                    {navigationItem.label}
                  </Link>
                ),
              )} */}
            </nav>
          </div>

          {/* Mobile categories */}
          <div className="px-5 py-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--store-text-primary)]">
                Categories
              </h2>

              <Link
                href="/store/products"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-xs font-medium text-[var(--store-primary)]"
              >
                View all
              </Link>
            </div>

            {categoryTree.length > 0 ? (
              <div>
                {categoryTree.map((item) => (
                  <MobileCategoryItem
                    key={item.category.id}
                    item={item}
                    onCategoryClick={
                      handleCategoryClick
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No categories found.
              </p>
            )}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="shrink-0 border-t border-[var(--store-border)] px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/store/dashboard/wishlist"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={`relative flex flex-col items-center justify-center gap-2 border border-[var(--store-border)] px-2 py-3 text-xs ${
                isWishlistActive
                  ? "text-[var(--store-primary)]"
                  : "text-[var(--store-text-primary)]"
              }`}
            >
              <Heart className="size-5" />

              Wishlist

              {favoriteCount > 0 && (
                <span className="absolute right-3 top-2 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                  {favoriteCount > 9
                    ? "9+"
                    : favoriteCount}
                </span>
              )}
            </Link>

            <Link
              href="/store/dashboard/active-cart"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={`relative flex flex-col items-center justify-center gap-2 border border-[var(--store-border)] px-2 py-3 text-xs ${
                isCartActive
                  ? "text-[var(--store-primary)]"
                  : "text-[var(--store-text-primary)]"
              }`}
            >
              <ShoppingBag className="size-5" />

              Cart

              {cartCount > 0 && (
                <span className="absolute right-3 top-2 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                  {cartCount > 9
                    ? "9+"
                    : cartCount}
                </span>
              )}
            </Link>

            <Link
              href={
                user
                  ? "/store/dashboard"
                  : "/store/login"
              }
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={`flex flex-col items-center justify-center gap-2 border border-[var(--store-border)] px-2 py-3 text-xs ${
                isAccountActive
                  ? "text-[var(--store-primary)]"
                  : "text-[var(--store-text-primary)]"
              }`}
            >
              <UserRound className="size-5" />

              {user ? "Account" : "Login"}
            </Link>
          </div>

          <a
            href={`tel:${phoneHref}`}
            className="mt-4 block text-center text-xs text-gray-500"
          >
            {phoneNumber}
          </a>
        </div>
      </aside>
    </>
  );
};

export default FurnitureNavbar;