"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
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

import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import { useCart } from "@/app/store/_components/contex/CartContex";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import { useTemplateProductWishListQuery } from "@/lib/api/hooks/template-product-wishList";
import { FAQItem } from "@/types/website/website";

import AvatarDropdown from "../../fashion/_components/avatar-dropdown";
import LogoComponent from "../../fashion/_components/logo/logo-component";
import SearchField from "./search-field";

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

const MobileCategoryItem = ({
  item,
  onCategoryClick,
}: {
  item: CategoryTreeItem;
  onCategoryClick: (categoryId: string) => void;
}) => {
  const hasChildren = item.children?.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => onCategoryClick(item.category.id)}
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

        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
      </summary>

      <div className="ml-3 mt-1 space-y-1 border-l-2 border-[var(--store-primary)] pl-3">
        <button
          type="button"
          onClick={() => onCategoryClick(item.category.id)}
          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--store-primary)] transition hover:bg-gray-100"
        >
          All {item.category.name}
        </button>

        {item.children.map((child) => (
          <MobileCategoryItem
            key={child.category.id}
            item={child}
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>
    </details>
  );
};

const GroceryNavbar = ({ phone }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [showSecondNavbar, setShowSecondNavbar] = useState(true);

  const { user } = useCart();

  const { data: categories } = useProductCategoryQuery();
  const { data: cart } = useAddActiveCArt();
  const { data: wishList } = useTemplateProductWishListQuery();

  const cartCount = cart?.items?.length ?? 0;
  const favoriteCount = wishList?.meta?.total ?? 0;

  const phoneNumber = phone?.trim() || "+880 1234-567890";
  const phoneHref = phoneNumber.replace(/[^\d+]/g, "");

  const isHomeActive = pathname === "/store";

  const isProductsActive =
    pathname === "/store/products" ||
    pathname.startsWith("/store/products/");

  const isWishlistActive = pathname.startsWith(
    "/store/dashboard/wishlist",
  );

  const isCartActive = pathname.startsWith(
    "/store/dashboard/active-cart",
  );

  const isAccountActive =
    pathname.startsWith("/store/dashboard") ||
    pathname.startsWith("/store/login");

  /*
   * Hide the second desktop navbar after scrolling.
   * Show it again when the user returns to the top.
   */
  useEffect(() => {
    const hideCategoryNavbar = () => {
      setShowSecondNavbar(false);
    };

    const showCategoryNavbar = () => {
      setShowSecondNavbar(true);
    };

    const handleWheel = (event: WheelEvent) => {
      // Scrolling inside the desktop category dropdown
      // should scroll the list, not hide the navbar.

      if (event.deltaY > 0) {
        hideCategoryNavbar();
        return;
      }

      if (event.deltaY < 0) {
        showCategoryNavbar();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // console.log('active', activeElement instanceof HTMLTextAreaElement)

      const isTyping =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.getAttribute("contenteditable") ===
        "true";

      if (isTyping) {
        return;
      }

      // Do not close the dropdown when keyboard input is
      // being used while focus is inside the category menu.

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

      if (hideKeys.includes(event.key)) {
        hideCategoryNavbar();
        return;
      }

      if (showKeys.includes(event.key)) {
        showCategoryNavbar();
      }

    };

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

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
   * Prevent body scrolling while the mobile category drawer is open.
   * Also close the drawer when Escape is pressed.
   */
  useEffect(() => {
    if (!mobileCategoriesOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileCategoriesOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileCategoriesOpen]);

  const handleCategoryClick = (categoryId: string) => {
    setDesktopCategoriesOpen(false);
    setMobileCategoriesOpen(false);

    router.push(`/store/products?categoryId=${categoryId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--store-bg-1)] shadow-sm">
        {/* First navbar */}
        <div className="border-b border-[var(--store-border)]">
          {/* Desktop navbar */}
          <div className="mx-auto hidden min-h-16 w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-6 lg:grid">
            {/* Logo */}
            <div className="flex items-center">
              <LogoComponent />
            </div>

            {/* Center search field */}
            <div className="mx-auto w-full max-w-2xl">
              <SearchField />
            </div>

            {/* Favourite and account */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/store/dashboard/wishlist"
                className="group relative flex items-center gap-2"
              >
                <span className="relative grid h-7 w-7 place-items-center rounded-full border border-[var(--store-border)] transition group-hover:border-[var(--store-primary)] bg-[var(--store-success)] text-white group-hover:text-[var(--store-primary)]">
                  <Heart className="h-4 w-4" />

                  {favoriteCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold text-white">
                      {favoriteCount}
                    </span>
                  )}
                </span>

                <span className="hidden xl:block">

                  <span className="block text-sm font-semibold text-[var(--store-text-primary)]">
                    Favorite
                  </span>
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden text-right xl:block">

                    <span className="block text-sm font-semibold text-[var(--store-text-primary)]">
                      Account
                    </span>
                  </div>

                  <AvatarDropdown />
                </div>
              ) : (
                <Link
                  href="/store/login"
                  className="group flex items-center gap-2"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--store-border)] transition group-hover:border-[var(--store-primary)] bg-[var(--store-success)] text-white group-hover:text-[var(--store-primary)]">
                    <UserRound className="h-4 w-4" />
                  </span>

                  <span className="hidden xl:block">

                    <span className="block text-sm font-semibold text-[var(--store-text-primary)]">
                      Account
                    </span>
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

        {/* Second navbar - desktop only */}
        <div
          className={`hidden transition-all duration-300 ease-in-out lg:block ${showSecondNavbar
            ? "max-h-14 overflow-visible border-b border-[var(--store-border)] opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 overflow-hidden border-b border-transparent opacity-0"
            }`}
        >
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            {/* Left side */}
            <div className="flex h-full items-center gap-8">
              <div className="relative h-full">
                <button
                  type="button"
                  onClick={() =>
                    setDesktopCategoriesOpen((previous) => !previous)
                  }
                  aria-expanded={desktopCategoriesOpen}
                  className="flex p-3 my-auto min-w-56 items-center justify-between gap-3 bg-[var(--store-dark)] font-semibold text-white rounded-lg"
                >
                  <span className="flex items-center gap-3">
                    <Menu className="h-5 w-5" />
                    Browse Categories
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${desktopCategoriesOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {desktopCategoriesOpen && (
                  <div className="absolute left-0 top-full z-[70] w-72 pt-2">
                    <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] p-2 shadow-2xl">
                      {categories?.length ? (
                        categories.map((item: CategoryTreeItem) => (
                          <MobileCategoryItem
                            key={item.category.id}
                            item={item}
                            onCategoryClick={handleCategoryClick}
                          />
                        ))
                      ) : (
                        <p className="px-4 py-5 text-center text-sm text-gray-500">
                          No categories found.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/store"
                className={`flex items-center gap-2 text-sm font-semibold transition hover:text-[var(--store-primary)] ${isHomeActive
                  ? "text-[var(--store-primary)]"
                  : "text-[var(--store-text-primary)]"
                  }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-7">
              <a
                href={`tel:${phoneHref}`}
                className="flex items-center gap-3 text-sm text-[var(--store-text-primary)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-[var(--store-primary)]">
                  <Phone className="h-4 w-4" />
                </span>

                <span>

                  <span className="font-semibold">
                    {phoneNumber}
                  </span>
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
      {desktopCategoriesOpen && (
        <button
          type="button"
          aria-label="Close category menu"
          onClick={() => setDesktopCategoriesOpen(false)}
          className="fixed inset-0 z-40 hidden bg-black/10 lg:block"
        />
      )}

      {/* Mobile category dark overlay */}
      <button
        type="button"
        aria-label="Close categories"
        onClick={() => setMobileCategoriesOpen(false)}
        className={`fixed inset-0 z-[85] bg-black/50 transition-opacity duration-300 lg:hidden ${mobileCategoriesOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
          }`}
      />

      {/* Mobile category left drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Browse categories"
        aria-hidden={!mobileCategoriesOpen}
        className={`fixed left-0 top-0 z-[90] flex h-dvh w-[80%] max-w-sm flex-col bg-[var(--store-bg-1)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileCategoriesOpen
          ? "translate-x-0"
          : "-translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--store-border)] px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <div className="min-w-0 pr-3">
            <h2 className="truncate text-lg font-bold text-[var(--store-text-primary)]">
              Browse Categories
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Select a category to browse products
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileCategoriesOpen(false)}
            aria-label="Close categories"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer category list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {categories?.length ? (
            <div className="space-y-1">
              {categories.map((item: CategoryTreeItem) => (
                <MobileCategoryItem
                  key={item.category.id}
                  item={item}
                  onCategoryClick={handleCategoryClick}
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
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${isHomeActive
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
              setMobileCategoriesOpen((previous) => !previous)
            }
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${mobileCategoriesOpen || isProductsActive
              ? "text-[var(--store-primary)]"
              : "text-gray-500"
              }`}
          >
            <Grid2X2 className="h-5 w-5" />
            Category
          </button>

          <Link
            href="/store/dashboard/active-cart"
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${isCartActive
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
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${isWishlistActive
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
            href={user ? "/store/dashboard" : "/store/login"}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${isAccountActive
              ? "text-[var(--store-primary)]"
              : "text-gray-500"
              }`}
          >
            {user ? (
              <UserRound className="h-5 w-5" />
            ) : (
              <LogIn className="h-5 w-5" />
            )}

            {user ? "Account" : "Login"}
          </Link>
        </div>
      </nav>
    </>
  );
};

export default GroceryNavbar;