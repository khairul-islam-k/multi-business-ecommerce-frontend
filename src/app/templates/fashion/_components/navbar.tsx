"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  GitCompareArrows,
  Heart,
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import { useCart } from "@/app/store/_components/contex/CartContex";
import AvatarDropdown from "./avatar-dropdown";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import StoreThemeToggle from "@/app/store/_components/store-theme-switcher";
import { useTemplateProductWishListQuery } from "@/lib/api/hooks/template-product-wishList";
import LogoComponent from "./logo/logo-component";

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

const pageLinks = [
  {
    label: "Contact Us",
    href: "/store/contact",
  },
  {
    label: "Privacy & Policy",
    href: "/store/privacy",
  },
  {
    label: "Term & Condition",
    href: "/store/term-condition",
  },
];

const IconButton = ({
  href,
  label,
  count,
  children,
  className = "",
}: {
  href: string;
  label: string;
  count?: number;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`relative grid h-10 w-10 place-items-center rounded-full transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white ${className}`}
    >
      {children}

      {typeof count === "number" && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
};

const CategoryMenuItem = ({
  item,
  onCategoryClick,
}: {
  item: CategoryTreeItem;
  onCategoryClick: (categoryId: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => onCategoryClick(item.category.id)}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-[#f16d59]/10 hover:text-[#f16d59]"
      >
        <span>{item.category.name}</span>

        {hasChildren && (
          <ChevronDown className="h-4 w-4 -rotate-90 text-gray-400" />
        )}
      </button>

      {hasChildren && open && (
        <div className="absolute left-full top-0 z-50 w-60 pl-2">
          <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            {item.children.map((child, index) => (
              <CategoryMenuItem
                key={`${child.category.id}-${index}`}
                item={child}
                onCategoryClick={onCategoryClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MobileCategoryItem = ({
  item,
  onCategoryClick,
}: {
  item: CategoryTreeItem;
  onCategoryClick: (categoryId: string) => void;
}) => {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => onCategoryClick(item.category.id)}
        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-white hover:text-[#f16d59]"
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <details>
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white">
        {item.category.name}

        <ChevronDown className="h-4 w-4" />
      </summary>

      <div className="mt-2 space-y-1 border-l-2 border-[#f16d59] pl-3">
        <button
          type="button"
          onClick={() => onCategoryClick(item.category.id)}
          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-white hover:text-[#f16d59]"
        >
          All {item.category.name}
        </button>

        {item.children.map((child, index) => (
          <MobileCategoryItem
            key={`${child.category.id}-${index}`}
            item={child}
            onCategoryClick={onCategoryClick}
          />
        ))}
      </div>
    </details>
  );
};

const FashionNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useCart();

  const { data: categories } = useProductCategoryQuery();
  const { data: cart } = useAddActiveCArt();
  const { data: wishList } = useTemplateProductWishListQuery();

  const cartCount = cart?.items.length ?? 0;
  const compareCount = 2;
  const favoriteCount = wishList?.meta.total ?? 0;

  /**
   * Check whether a navbar route is currently active.
   *
   * Home uses exact matching because every store route begins with "/store".
   * Other routes use startsWith so their nested pages remain active.
   */
  const isActive = (href: string) => {
    if (href === "/store") {
      return pathname === "/store";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const productsActive = isActive("/store/products");

  const pagesActive = pageLinks.some((link) => isActive(link.href));

  const handleCategoryClick = (categoryId: string) => {
    setMobileMenuOpen(false);

    router.push(`/store/products?categoryId=${categoryId}`);
  };

  const desktopLinkClass = (href: string) => {
    return `relative text-sm font-medium transition hover:text-[#f16d59] ${isActive(href) ? "text-[#f16d59]" : ""
      }`;
  };

  const mobileLinkClass = (href: string) => {
    return `block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(href)
      ? "bg-[#f16d59]/10 text-[#f16d59]"
      : "text-gray-700 hover:bg-gray-100 hover:text-[#f16d59]"
      }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--store-bg-1)]">
      <nav className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Logo */}
        <LogoComponent />

        {/* Desktop navigation */}
        <div className="hidden items-center justify-center gap-8 lg:flex">
          {/* Home */}
          <Link
            href="/store"
            aria-current={isActive("/store") ? "page" : undefined}
            className={desktopLinkClass("/store")}
          >
            Home

            {isActive("/store") && (
              <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
            )}
          </Link>

          {/* Products dropdown */}
          <div className="group relative">
            <button
              type="button"
              className={`relative flex items-center gap-1 text-sm font-medium transition hover:text-[#f16d59] ${productsActive ? "text-[#f16d59]" : ""
                }`}
            >
              Products

              <ChevronDown className="h-4 w-4 transition duration-300 group-hover:rotate-180" />

              {productsActive && (
                <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
              )}
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl bg-white p-2 shadow-xl">
                {categories?.map((item, index) => (
                  <CategoryMenuItem
                    key={`${item.category.id}-${index}`}
                    item={item}
                    onCategoryClick={handleCategoryClick}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pages dropdown */}
          <div className="group relative">
            <button
              type="button"
              className={`relative flex items-center gap-1 text-sm font-medium transition hover:text-[#f16d59] ${pagesActive ? "text-[#f16d59]" : ""
                }`}
            >
              Pages

              <ChevronDown className="h-4 w-4 transition duration-300 group-hover:rotate-180" />

              {pagesActive && (
                <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
              )}
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {pageLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${isActive(link.href)
                      ? "bg-[#f16d59]/10 text-[#f16d59]"
                      : "text-gray-700 hover:bg-[#f16d59]/10 hover:text-[#f16d59]"
                      }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {link.label}

                      {isActive(link.href) && (
                        <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <Link
            href="/store/faq"
            aria-current={isActive("/store/faq") ? "page" : undefined}
            className={desktopLinkClass("/store/faq")}
          >
            FAQ

            {isActive("/store/faq") && (
              <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
            )}
          </Link>

          {/* Contact */}
          <Link
            href="/store/contact"
            aria-current={isActive("/store/contact") ? "page" : undefined}
            className={desktopLinkClass("/store/contact")}
          >
            Contact Us

            {isActive("/store/contact") && (
              <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
            )}
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center justify-end gap-2">
          <IconButton
            href="/search"
            label="Search"
            className="hidden lg:grid"
          >
            <Search className="h-5 w-5" />
          </IconButton>

          <IconButton
            href="/store/dashboard/wishlist"
            label="Wishlist"
            count={favoriteCount}
            className="hidden lg:grid"
          >
            <Heart className="h-5 w-5" />
          </IconButton>

          <IconButton
            href="/store/dashboard/active-cart"
            label="Cart"
            count={cartCount}
            className="hidden lg:grid"
          >
            <ShoppingBag className="h-5 w-5" />
          </IconButton>

          <StoreThemeToggle />

          {user ? (
            <AvatarDropdown />
          ) : (
            <Link
              href="/store/login"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f16d59] px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-950"
            >
              <LogIn className="hidden h-4 w-4 sm:block" />
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-900 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
          <div className="space-y-2">
            {/* Home */}
            <Link
              href="/store"
              aria-current={isActive("/store") ? "page" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass("/store")}
            >
              <span className="flex items-center justify-between">
                Home

                {isActive("/store") && (
                  <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                )}
              </span>
            </Link>

            {/* Products */}
            <details open={productsActive || undefined}>
              <summary
                className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${productsActive
                  ? "bg-[#f16d59]/10 text-[#f16d59]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#f16d59]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  Products

                  {productsActive && (
                    <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                  )}
                </span>

                <ChevronDown className="h-4 w-4" />
              </summary>

              <div className="mt-2 space-y-1 rounded-xl bg-gray-50 p-3">
                {categories?.map((item, index) => (
                  <MobileCategoryItem
                    key={`${item.category.id}-${index}`}
                    item={item}
                    onCategoryClick={handleCategoryClick}
                  />
                ))}
              </div>
            </details>

            {/* Pages */}
            <details open={pagesActive || undefined}>
              <summary
                className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${pagesActive
                  ? "bg-[#f16d59]/10 text-[#f16d59]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#f16d59]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  Pages

                  {pagesActive && (
                    <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                  )}
                </span>

                <ChevronDown className="h-4 w-4" />
              </summary>

              <div className="mt-2 space-y-1 rounded-xl bg-gray-50 p-3">
                {pageLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive(link.href)
                      ? "bg-white text-[#f16d59] shadow-sm"
                      : "text-gray-700 hover:bg-white hover:text-[#f16d59]"
                      }`}
                  >
                    <span className="flex items-center justify-between">
                      {link.label}

                      {isActive(link.href) && (
                        <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </details>

            {/* FAQ */}
            <Link
              href="/store/faq"
              aria-current={isActive("/store/faq") ? "page" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass("/store/faq")}
            >
              <span className="flex items-center justify-between">
                FAQ

                {isActive("/store/faq") && (
                  <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                )}
              </span>
            </Link>

            {/* Contact */}
            <Link
              href="/store/contact"
              aria-current={
                isActive("/store/contact") ? "page" : undefined
              }
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass("/store/contact")}
            >
              <span className="flex items-center justify-between">
                Contact Us

                {isActive("/store/contact") && (
                  <span className="h-2 w-2 rounded-full bg-[#f16d59]" />
                )}
              </span>
            </Link>

            {/* Mobile icons */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-4 gap-3">
                <Link
                  href="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-xs font-medium text-gray-700 transition hover:border-[#f16d59] hover:text-[#f16d59]"
                >
                  <Search className="h-5 w-5" />
                  Search
                </Link>

                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-xs font-medium text-gray-700 transition hover:border-[#f16d59] hover:text-[#f16d59]"
                >
                  <GitCompareArrows className="h-5 w-5" />
                  Compare

                  {compareCount > 0 && (
                    <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
                      {compareCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/store/dashboard/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-xs font-medium text-gray-700 transition hover:border-[#f16d59] hover:text-[#f16d59]"
                >
                  <Heart className="h-5 w-5" />
                  Favorite

                  {favoriteCount > 0 && (
                    <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/store/dashboard/active-cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-950 bg-gray-950 py-3 text-xs font-medium text-white"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Cart

                  {cartCount > 0 && (
                    <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {!user && (
                <Link
                  href="/store/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f16d59] px-5 text-sm font-semibold text-white transition hover:bg-gray-950"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FashionNavbar;