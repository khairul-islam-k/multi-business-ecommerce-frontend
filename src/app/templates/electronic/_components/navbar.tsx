"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Grid2X2,
  Heart,
  Home,
  LogIn,
  Menu,
  Phone,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useCart } from "@/app/store/_components/contex/CartContex";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import { useTemplateProductWishListQuery } from "@/lib/api/hooks/template-product-wishList";
import { FAQItem } from "@/types/website/website";

import AvatarDropdown from "../../fashion/_components/avatar-dropdown";
import LogoComponent from "../../fashion/_components/logo/logo-component";
import SearchField from "../../grocery/_components/search-field";

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

type CategoryItemProps = {
  item: CategoryTreeItem;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

/*
 * Mobile category item
 */
const MobileCategoryItem = ({
  item,
  onCategoryClick,
}: CategoryItemProps) => {
  const hasChildren =
    item.children?.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--store-text-primary)] transition hover:bg-gray-100 hover:text-[var(--store-primary)]"
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--store-text-primary)] transition hover:bg-gray-100">
        <span>{item.category.name}</span>

        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="ml-3 mt-1 space-y-1 border-l-2 border-[var(--store-primary)] pl-3">
        <button
          type="button"
          onClick={() =>
            onCategoryClick(
              item.category.id,
            )
          }
          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--store-primary)] transition hover:bg-gray-100"
        >
          All {item.category.name}
        </button>

        {item.children.map((child) => (
          <MobileCategoryItem
            key={child.category.id}
            item={child}
            onCategoryClick={
              onCategoryClick
            }
          />
        ))}
      </div>
    </details>
  );
};

type DesktopRootCategoryProps = {
  item: CategoryTreeItem;
  active: boolean;
  isLast: boolean;
  onHover: (
    categoryId: string | null,
  ) => void;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

/*
 * Parent category shown in the
 * left side of the desktop menu.
 */
const DesktopRootCategory = ({
  item,
  active,
  isLast,
  onHover,
  onCategoryClick,
}: DesktopRootCategoryProps) => {
  const hasChildren =
    item.children?.length > 0;

  const handleHover = () => {
    onHover(
      hasChildren
        ? item.category.id
        : null,
    );
  };

  return (
    <button
      type="button"
      onMouseEnter={handleHover}
      onFocus={handleHover}
      onClick={() =>
        onCategoryClick(item.category.id)
      }
      aria-haspopup={
        hasChildren ? "menu" : undefined
      }
      className={`flex w-full items-center justify-between gap-3 px-1 py-[9px] text-left text-[14px] leading-5 transition ${
        !isLast
          ? "border-b border-[#dddddd]"
          : ""
      } ${
        active
          ? "bg-[#f1f1f1] font-bold text-[#202936]"
          : "font-normal text-[#4b5563] hover:bg-[#f6f6f6] hover:text-[#202936]"
      }`}
    >
      <span className="min-w-0 truncate">
        {item.category.name}
      </span>

      {hasChildren && (
        <ChevronRight
          className={`h-4 w-4 shrink-0 transition-transform ${
            active
              ? "translate-x-0.5 text-[#aaaaaa]"
              : "text-[#b5b5b5]"
          }`}
        />
      )}
    </button>
  );
};

type DesktopNestedCategoryProps = {
  item: CategoryTreeItem;
  onCategoryClick: (
    categoryId: string,
  ) => void;
  depth?: number;
};

/*
 * Children and nested children shown
 * inside the right-side desktop panel.
 */
const DesktopNestedCategory = ({
  item,
  onCategoryClick,
  depth = 0,
}: DesktopNestedCategoryProps) => {
  const hasChildren =
    item.children?.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className={`block w-full text-left text-[15px] leading-6 text-[#4b5563] transition hover:text-[var(--store-primary)] ${
          depth > 0 ? "pl-3" : ""
        }`}
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <div className="border-t border-[#dddddd] pt-3 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="block w-full text-left text-[15px] font-medium leading-6 text-[#4b5563] transition hover:text-[var(--store-primary)]"
      >
        {item.category.name}
      </button>

      <div className="mt-2 space-y-2">
        {item.children.map((child) => (
          <DesktopNestedCategory
            key={child.category.id}
            item={child}
            depth={depth + 1}
            onCategoryClick={
              onCategoryClick
            }
          />
        ))}
      </div>
    </div>
  );
};

type DesktopChildrenPanelProps = {
  item: CategoryTreeItem;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

/*
 * Right-side children panel.
 */
const DesktopChildrenPanel = ({
  item,
  onCategoryClick,
}: DesktopChildrenPanelProps) => {
  return (
    <div
      role="menu"
      aria-label={`${item.category.name} categories`}
      className="min-h-[360px] w-[360px] shrink-0 border-l border-[#dddddd] bg-[var(--store-bg-1)]"
    >
      <div className="max-h-[460px] overflow-y-auto px-8 py-5">
        <button
          type="button"
          onClick={() =>
            onCategoryClick(
              item.category.id,
            )
          }
          className="block w-full text-left text-[15px] font-bold leading-6 text-[#303945] transition hover:text-[var(--store-primary)]"
        >
          {item.category.name}
        </button>

        <div className="mt-3 space-y-3">
          {item.children.map((child) => (
            <DesktopNestedCategory
              key={child.category.id}
              item={child}
              onCategoryClick={
                onCategoryClick
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ElectronicNavbar = ({
  phone,
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  /*
   * Desktop menu is initially open.
   */
  const [
    desktopCategoriesOpen,
    setDesktopCategoriesOpen,
  ] = useState(true);

  const [
    activeDesktopCategoryId,
    setActiveDesktopCategoryId,
  ] = useState<string | null>(null);

  const [
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
  ] = useState(false);

  const [
    showSecondNavbar,
    setShowSecondNavbar,
  ] = useState(true);

  const { user } = useCart();

  const { data: categories } =
    useProductCategoryQuery();

  const { data: cart } =
    useAddActiveCArt();

  const { data: wishList } =
    useTemplateProductWishListQuery();

  const categoryItems =
    (categories ?? []) as CategoryTreeItem[];

  const activeDesktopCategory =
    categoryItems.find(
      (item) =>
        item.category.id ===
          activeDesktopCategoryId &&
        item.children?.length > 0,
    ) ?? null;

  const cartCount =
    cart?.items?.length ?? 0;

  const favoriteCount =
    wishList?.meta?.total ?? 0;

  const phoneNumber =
    phone?.trim() ||
    "+880 1234-567890";

  const phoneHref =
    phoneNumber.replace(/[^\d+]/g, "");

  const isHomeActive =
    pathname === "/store";

  const isProductsActive =
    pathname === "/store/products" ||
    pathname.startsWith(
      "/store/products/",
    );

  const isWishlistActive =
    pathname.startsWith(
      "/store/dashboard/wishlist",
    );

  const isCartActive =
    pathname.startsWith(
      "/store/dashboard/active-cart",
    );

  const isAccountActive =
    pathname.startsWith(
      "/store/dashboard",
    ) ||
    pathname.startsWith(
      "/store/login",
    );

  /*
   * Hide second navbar when scrolling down
   * and show it when scrolling up.
   */
  useEffect(() => {
    const hideCategoryNavbar = () => {
      setShowSecondNavbar(false);
      setDesktopCategoriesOpen(false);
      setActiveDesktopCategoryId(null);
    };

    const showCategoryNavbar = () => {
      setShowSecondNavbar(true);
    };

    const handleWheel = (
      event: WheelEvent,
    ) => {
      /*
       * Scrolling inside the category menu
       * should not hide the navbar.
       */
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest(
          "[data-desktop-category-menu='true']",
        )
      ) {
        return;
      }

      if (event.deltaY > 0) {
        hideCategoryNavbar();
        return;
      }

      if (event.deltaY < 0) {
        showCategoryNavbar();
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const activeElement =
        document.activeElement;

      const isTyping =
        activeElement instanceof
          HTMLInputElement ||
        activeElement instanceof
          HTMLTextAreaElement ||
        activeElement instanceof
          HTMLSelectElement ||
        activeElement?.getAttribute(
          "contenteditable",
        ) === "true";

      if (isTyping) {
        return;
      }

      const hideKeys = [
        "ArrowDown",
        "PageDown",
        "End",
        " ",
      ];

      const showKeys = [
        "ArrowUp",
        "PageUp",
        "Home",
      ];

      if (
        hideKeys.includes(event.key)
      ) {
        hideCategoryNavbar();
        return;
      }

      if (
        showKeys.includes(event.key)
      ) {
        showCategoryNavbar();
      }
    };

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel,
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /*
   * Prevent body scrolling while the
   * mobile category drawer is open.
   */
  useEffect(() => {
    if (!mobileCategoriesOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setMobileCategoriesOpen(false);
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
  }, [mobileCategoriesOpen]);

  const handleCategoryClick = (
    categoryId: string,
  ) => {
    setDesktopCategoriesOpen(false);
    setActiveDesktopCategoryId(null);
    setMobileCategoriesOpen(false);

    router.push(
      `/store/products?categoryId=${categoryId}`,
    );
  };

  const handleDesktopMenuToggle = () => {
    setDesktopCategoriesOpen(
      (previous) => {
        if (previous) {
          setActiveDesktopCategoryId(
            null,
          );
        }

        return !previous;
      },
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--store-bg-1)] shadow-sm">
        {/* First navbar */}
        <div className="border-b border-[var(--store-border)]">
          {/* Desktop navbar */}
          <div className="mx-auto hidden min-h-16 w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-6 lg:grid">
            <div className="flex items-center">
              <LogoComponent />
            </div>

            <div className="mx-auto w-full max-w-2xl">
              <SearchField />
            </div>

            <div className="flex items-center justify-end gap-4">
              <Link
                href="/store/dashboard/wishlist"
                className="group relative flex items-center gap-2"
              >
                <span className="relative grid h-7 w-7 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-success)] text-white transition group-hover:border-[var(--store-primary)] group-hover:text-[var(--store-primary)]">
                  <Heart className="h-4 w-4" />

                  {favoriteCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold text-white">
                      {favoriteCount}
                    </span>
                  )}
                </span>

                <span className="hidden text-sm font-semibold text-[var(--store-text-primary)] xl:block">
                  Favorite
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden text-sm font-semibold text-[var(--store-text-primary)] xl:block">
                    Account
                  </span>

                  <AvatarDropdown />
                </div>
              ) : (
                <Link
                  href="/store/login"
                  className="group flex items-center gap-2"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-success)] text-white transition group-hover:border-[var(--store-primary)] group-hover:text-[var(--store-primary)]">
                    <UserRound className="h-4 w-4" />
                  </span>

                  <span className="hidden text-sm font-semibold text-[var(--store-text-primary)] xl:block">
                    Account
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile navbar */}
          <div className="relative mx-auto max-w-7xl px-4 py-2 lg:hidden">
            <div className="flex min-h-11 items-center justify-between">
              <LogoComponent />

              <div className="flex items-center gap-2">
                <SearchField />
              </div>
            </div>
          </div>
        </div>

        {/* Second desktop navbar */}
        <div
          className={`hidden transition-all duration-300 ease-in-out lg:block ${
            showSecondNavbar
              ? "max-h-14 overflow-visible border-b border-[var(--store-border)] opacity-100"
              : "pointer-events-none max-h-0 -translate-y-2 overflow-hidden border-b border-transparent opacity-0"
          }`}
        >
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <div className="flex h-full items-center gap-8">
              {/* Desktop category menu */}
              <div
                data-desktop-category-menu="true"
                className="relative h-full w-[270px] shrink-0"
              >
                <button
                  type="button"
                  onClick={
                    handleDesktopMenuToggle
                  }
                  aria-expanded={
                    desktopCategoriesOpen
                  }
                  className={`flex h-full w-full items-center gap-3 bg-[#ffd600] px-6 text-[15px] font-bold text-[#1f2937] transition-colors hover:bg-[#f4cc00] ${
                    desktopCategoriesOpen
                      ? "rounded-t-lg"
                      : "rounded-lg"
                  }`}
                >
                  <Menu className="h-5 w-5 shrink-0 stroke-[2.3]" />

                  <span className="truncate">
                    All Departments
                  </span>
                </button>

                {desktopCategoriesOpen && (
                  <div
                    onMouseLeave={() =>
                      setActiveDesktopCategoryId(
                        null,
                      )
                    }
                    className="absolute left-0 top-full z-[70] flex items-stretch overflow-hidden rounded-b-lg border border-t-0 border-[#e0e0e0] bg-[var(--store-bg-1)] shadow-[0_12px_30px_rgba(0,0,0,0.13)]"
                  >
                    {/* Left parent category list */}
                    <div className="min-h-[360px] w-[270px] shrink-0 bg-[var(--store-bg-1)] px-4 py-1">
                      <div className="max-h-[460px] overflow-y-auto">
                        {categoryItems.length ? (
                          categoryItems.map(
                            (item, index) => (
                              <DesktopRootCategory
                                key={
                                  item
                                    .category
                                    .id
                                }
                                item={item}
                                active={
                                  activeDesktopCategoryId ===
                                  item
                                    .category
                                    .id
                                }
                                isLast={
                                  index ===
                                  categoryItems.length -
                                    1
                                }
                                onHover={
                                  setActiveDesktopCategoryId
                                }
                                onCategoryClick={
                                  handleCategoryClick
                                }
                              />
                            ),
                          )
                        ) : (
                          <p className="px-4 py-8 text-center text-sm text-gray-500">
                            No categories
                            found.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right children panel */}
                    {activeDesktopCategory && (
                      <DesktopChildrenPanel
                        item={
                          activeDesktopCategory
                        }
                        onCategoryClick={
                          handleCategoryClick
                        }
                      />
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/store"
                className={`flex items-center gap-2 text-sm font-semibold transition hover:text-[var(--store-primary)] ${
                  isHomeActive
                    ? "text-[var(--store-primary)]"
                    : "text-[var(--store-text-primary)]"
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>

            <div className="flex items-center gap-7">
              <a
                href={`tel:${phoneHref}`}
                className="flex items-center gap-3 text-sm text-[var(--store-text-primary)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-[var(--store-primary)]">
                  <Phone className="h-4 w-4" />
                </span>

                <span className="font-semibold">
                  {phoneNumber}
                </span>
              </a>

              <Link
                href="/store/dashboard/active-cart"
                className="relative flex h-11 items-center gap-3 rounded-full bg-[var(--store-success)] px-6 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <ShoppingBag className="h-5 w-5" />

                My Cart

                {cartCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-[var(--store-primary)]">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop category overlay */}
      {desktopCategoriesOpen &&
        showSecondNavbar && (
          <button
            type="button"
            aria-label="Close category menu"
            onClick={() => {
              setDesktopCategoriesOpen(
                false,
              );
              setActiveDesktopCategoryId(
                null,
              );
            }}
            className="fixed inset-0 z-40 hidden bg-black/5 lg:block"
          />
        )}

      {/* Mobile dark overlay */}
      <button
        type="button"
        aria-label="Close categories"
        onClick={() =>
          setMobileCategoriesOpen(false)
        }
        className={`fixed inset-0 z-[85] bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileCategoriesOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      {/* Mobile category drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Browse categories"
        aria-hidden={
          !mobileCategoriesOpen
        }
        className={`fixed left-0 top-0 z-[90] flex h-dvh w-[80%] max-w-sm flex-col bg-[var(--store-bg-1)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileCategoriesOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--store-border)] px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <div className="min-w-0 pr-3">
            <h2 className="truncate text-lg font-bold text-[var(--store-text-primary)]">
              Browse Categories
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Select a category to browse
              products
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileCategoriesOpen(false)
            }
            aria-label="Close categories"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {categoryItems.length ? (
            <div className="space-y-1">
              {categoryItems.map((item) => (
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
            <p className="py-10 text-center text-sm text-gray-500">
              No categories found.
            </p>
          )}
        </div>
      </aside>

      {/* Fixed mobile bottom navbar */}
      <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-[var(--store-border)] bg-[var(--store-bg-1)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="grid h-17 grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          <Link
            href="/store"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              isHomeActive
                ? "text-[var(--store-primary)]"
                : "text-gray-500"
            }`}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileCategoriesOpen(
                (previous) => !previous,
              )
            }
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              mobileCategoriesOpen ||
              isProductsActive
                ? "text-[var(--store-primary)]"
                : "text-gray-500"
            }`}
          >
            <Grid2X2 className="h-5 w-5" />
            Category
          </button>

          <Link
            href="/store/dashboard/active-cart"
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              isCartActive
                ? "text-[var(--store-primary)]"
                : "text-gray-500"
            }`}
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>

            Cart
          </Link>

          <Link
            href="/store/dashboard/wishlist"
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              isWishlistActive
                ? "text-[var(--store-primary)]"
                : "text-gray-500"
            }`}
          >
            <span className="relative">
              <Heart className="h-5 w-5" />

              {favoriteCount > 0 && (
                <span className="absolute -right-3 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold text-white">
                  {favoriteCount}
                </span>
              )}
            </span>

            Wishlist
          </Link>

          <Link
            href={
              user
                ? "/store/dashboard"
                : "/store/login"
            }
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              isAccountActive
                ? "text-[var(--store-primary)]"
                : "text-gray-500"
            }`}
          >
            {user ? (
              <UserRound className="h-5 w-5" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}

            {user
              ? "Account"
              : "Login"}
          </Link>
        </div>
      </nav>
    </>
  );
};

export default ElectronicNavbar;