"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Home,
  LayoutGrid,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { useCart } from "@/app/store/_components/contex/CartContex";
import StoreThemeToggle from "@/app/store/_components/store-theme-switcher";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import { useTemplateProductWishListQuery } from "@/lib/api/hooks/template-product-wishList";
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
};

/**
 * Keeps the theme toggle inside a fixed 40x40 area.
 * This prevents an absolute-positioned toggle button
 * from overlapping the search button.
 */
const ThemeToggleButton = () => {
  return (
    <div
    >
      <StoreThemeToggle />
    </div>
  );
};

const IconButton = ({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className="
        relative grid h-10 w-10 shrink-0
        place-items-center rounded-full
        border border-black/10
        text-[var(--store-text-primary)]
        transition duration-300
        hover:border-[#f16d59]
        hover:bg-[#f16d59]
        hover:text-white
        dark:border-white/10
      "
    >
      {children}

      {typeof count === "number" && count > 0 && (
        <span
          className="
            absolute -right-1 -top-1
            grid h-5 min-w-5 place-items-center
            rounded-full bg-[#f16d59] px-1
            text-[10px] font-bold text-white
          "
        >
          {count > 99 ? "99+" : count}
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

  const hasChildren =
    Array.isArray(item.children) &&
    item.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="
          flex w-full items-center justify-between
          gap-3 rounded-lg px-4 py-2.5
          text-left text-sm font-medium
          text-[var(--store-text-primary)]
          transition
          hover:bg-[#f16d59]/10
          hover:text-[#f16d59]
        "
      >
        <span className="truncate">
          {item.category.name}
        </span>

        {hasChildren && (
          <ChevronDown
            className="
              h-4 w-4 shrink-0
              -rotate-90 opacity-60
            "
          />
        )}
      </button>

      {hasChildren && open && (
        <div
          className="
            absolute left-full top-0
            z-50 w-64 pl-2
          "
        >
          <div
            className="
              rounded-xl border border-black/10
              bg-[var(--store-bg-1)]
              p-2 shadow-xl
              dark:border-white/10
            "
          >
            {item.children.map((child) => (
              <CategoryMenuItem
                key={child.category.id}
                item={child}
                onCategoryClick={
                  onCategoryClick
                }
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
  const hasChildren =
    Array.isArray(item.children) &&
    item.children.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="
          block w-full rounded-xl
          px-3 py-2.5 text-left
          text-sm font-medium
          text-[var(--store-text-primary)]
          transition
          hover:bg-[#f16d59]/10
          hover:text-[#f16d59]
        "
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <details className="group">
      <summary
        className="
          flex cursor-pointer list-none
          items-center justify-between
          rounded-xl px-3 py-2.5
          text-sm font-medium
          text-[var(--store-text-primary)]
          transition
          hover:bg-[#f16d59]/10
        "
      >
        <span className="truncate">
          {item.category.name}
        </span>

        <ChevronDown
          className="
            h-4 w-4 shrink-0
            transition
            group-open:rotate-180
          "
        />
      </summary>

      <div
        className="
          ml-3 mt-1 space-y-1
          border-l-2 border-[#f16d59]/30
          pl-3
        "
      >
        <button
          type="button"
          onClick={() =>
            onCategoryClick(item.category.id)
          }
          className="
            block w-full rounded-xl
            px-3 py-2 text-left
            text-sm font-medium
            text-[#f16d59]
            transition
            hover:bg-[#f16d59]/10
          "
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

const MobileNavigationLink = ({
  href,
  label,
  active,
  count,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  count?: number;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={
        active ? "page" : undefined
      }
      className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
        active
          ? "text-[#f16d59]"
          : "text-[var(--store-text-primary)] opacity-70 hover:text-[#f16d59] hover:opacity-100"
      }`}
    >
      <span className="relative">
        {children}

        {typeof count === "number" &&
          count > 0 && (
            <span
              className="
                absolute -right-3 -top-2
                grid h-4 min-w-4
                place-items-center
                rounded-full bg-[#f16d59]
                px-1 text-[9px]
                font-bold leading-none
                text-white
              "
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
      </span>

      <span>{label}</span>

      {active && (
        <span
          className="
            absolute bottom-0
            h-0.5 w-8 rounded-full
            bg-[#f16d59]
          "
        />
      )}
    </Link>
  );
};

const CosmeticsNavbar = ({
  faqs: _faqs,
  privacy: _privacy,
  terms: _terms,
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    mobileCategoryOpen,
    setMobileCategoryOpen,
  ] = useState(false);

  const { user } = useCart();

  const { data: categories } =
    useProductCategoryQuery();

  const { data: cart } =
    useAddActiveCArt();

  const { data: wishList } =
    useTemplateProductWishListQuery();

  const cartCount =
    cart?.items?.length ?? 0;

  const favoriteCount =
    wishList?.meta?.total ?? 0;

  const userHref = user
    ? "/store/dashboard"
    : "/store/login";

  const isActive = (href: string) => {
    if (href === "/store") {
      return pathname === "/store";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const productsActive = isActive(
    "/store/products",
  );

  const cartActive = isActive(
    "/store/dashboard/active-cart",
  );

  const wishlistActive = isActive(
    "/store/dashboard/wishlist",
  );

  const userActive = user
    ? isActive("/store/dashboard") &&
      !cartActive &&
      !wishlistActive
    : isActive("/store/login");

  useEffect(() => {
    setSearchOpen(false);
    setMobileCategoryOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileCategoryOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileCategoryOpen]);

  const handleCategoryClick = (
    categoryId: string,
  ) => {
    setMobileCategoryOpen(false);

    router.push(
      `/store/products?categoryId=${categoryId}`,
    );
  };

  const handleAllProductsClick = () => {
    setMobileCategoryOpen(false);
    router.push("/store/products");
  };

  const handleSearchToggle = () => {
    setMobileCategoryOpen(false);

    setSearchOpen(
      (previous) => !previous,
    );
  };

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = searchTerm.trim();

    setSearchOpen(false);

    if (!value) {
      router.push("/store/products");
      return;
    }

    router.push(
      `/store/products?search=${encodeURIComponent(
        value,
      )}`,
    );
  };

  const desktopLinkClass = (
    href: string,
  ) => {
    return `relative py-2 text-sm font-semibold transition hover:text-[#f16d59] ${
      isActive(href)
        ? "text-[#f16d59]"
        : "text-[var(--store-text-primary)]"
    }`;
  };

  return (
    <>
      <header
        className="
          sticky top-0 z-50
          border-b border-black/10
          bg-[var(--store-bg-1)]/95
          backdrop-blur-xl
          dark:border-white/10
        "
      >
        {/* Desktop navbar */}
        <nav
          className="
            mx-auto hidden h-20 max-w-7xl
            grid-cols-[1fr_auto_1fr]
            items-center gap-8
            px-6
            lg:grid
            xl:px-8
          "
        >
          {/* Left navigation */}
          <div className="flex items-center justify-start gap-8">
            <Link
              href="/store"
              aria-current={
                isActive("/store")
                  ? "page"
                  : undefined
              }
              className={desktopLinkClass(
                "/store",
              )}
            >
              Home

              {isActive("/store") && (
                <span
                  className="
                    absolute inset-x-0
                    -bottom-[22px]
                    mx-auto h-0.5 w-full
                    rounded-full bg-[#f16d59]
                  "
                />
              )}
            </Link>

            <div className="group relative">
              <Link
                href="/store/products"
                aria-current={
                  productsActive
                    ? "page"
                    : undefined
                }
                className={`relative flex items-center gap-1 py-2 text-sm font-semibold transition hover:text-[#f16d59] ${
                  productsActive
                    ? "text-[#f16d59]"
                    : "text-[var(--store-text-primary)]"
                }`}
              >
                Products

                <ChevronDown
                  className="
                    h-4 w-4
                    transition duration-300
                    group-hover:rotate-180
                  "
                />

                {productsActive && (
                  <span
                    className="
                      absolute inset-x-0
                      -bottom-[22px]
                      mx-auto h-0.5 w-full
                      rounded-full bg-[#f16d59]
                    "
                  />
                )}
              </Link>

              <div
                className="
                  invisible absolute
                  left-0 top-full z-50
                  w-72 pt-5 opacity-0
                  transition-all duration-200
                  group-hover:visible
                  group-hover:opacity-100
                "
              >
                <div
                  className="
                    rounded-2xl
                    border border-black/10
                    bg-[var(--store-bg-1)]
                    p-2 shadow-2xl
                    dark:border-white/10
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleAllProductsClick
                    }
                    className="
                      mb-1 block w-full
                      rounded-lg px-4 py-2.5
                      text-left text-sm
                      font-semibold
                      text-[#f16d59]
                      transition
                      hover:bg-[#f16d59]/10
                    "
                  >
                    All Products
                  </button>

                  <div
                    className="
                      my-1 h-px
                      bg-black/10
                      dark:bg-white/10
                    "
                  />

                  {categories?.length ? (
                    categories.map((item) => (
                      <CategoryMenuItem
                        key={
                          item.category.id
                        }
                        item={item}
                        onCategoryClick={
                          handleCategoryClick
                        }
                      />
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm opacity-60">
                      No categories found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center logo */}
          <div
            className="
              flex min-w-0
              items-center justify-center
              [&_img]:max-w-[220px]
            "
          >
            <LogoComponent />
          </div>

          {/* Desktop right actions */}
          <div className="flex items-center justify-end gap-2">
            <ThemeToggleButton />

            <button
              type="button"
              onClick={handleSearchToggle}
              aria-label={
                searchOpen
                  ? "Close search"
                  : "Search products"
              }
              aria-expanded={searchOpen}
              className="
                grid h-10 w-10
                shrink-0 place-items-center
                rounded-full
                border border-black/10
                text-[var(--store-text-primary)]
                transition duration-300
                hover:border-[#f16d59]
                hover:bg-[#f16d59]
                hover:text-white
                dark:border-white/10
              "
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center">
                <AvatarDropdown />
              </div>
            ) : (
              <IconButton
                href="/store/login"
                label="Login"
              >
                <UserRound className="h-5 w-5" />
              </IconButton>
            )}

            <IconButton
              href="/store/dashboard/active-cart"
              label="Shopping cart"
              count={cartCount}
            >
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
          </div>
        </nav>

        {/* Mobile top navbar */}
        <nav
          className="
            mx-auto flex h-16
            items-center gap-3
            px-4
            lg:hidden
          "
        >
          {/* Mobile logo */}
          <div
            className="
              min-w-0 flex-1
              overflow-hidden
              [&_img]:!h-9
              [&_img]:!w-auto
              [&_span]:max-w-[150px]
            "
          >
            <LogoComponent />
          </div>

          {/* Mobile right actions */}
          <div
            className="
              flex shrink-0
              items-center gap-2
            "
          >
            <ThemeToggleButton />

            <button
              type="button"
              onClick={handleSearchToggle}
              aria-label={
                searchOpen
                  ? "Close search"
                  : "Search products"
              }
              aria-expanded={searchOpen}
              className="
                relative grid h-10 w-10
                shrink-0 place-items-center
                rounded-full
                border border-black/10
                text-[var(--store-text-primary)]
                transition
                hover:border-[#f16d59]
                hover:bg-[#f16d59]
                hover:text-white
                dark:border-white/10
              "
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Search panel */}
        {searchOpen && (
          <div
            className="
              border-t border-black/10
              bg-[var(--store-bg-1)]
              px-4 py-4 shadow-lg
              dark:border-white/10
            "
          >
            <form
              onSubmit={handleSearchSubmit}
              className="
                mx-auto flex max-w-3xl
                items-center gap-2
              "
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    h-5 w-5
                    -translate-y-1/2
                    opacity-50
                  "
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  placeholder="Search products..."
                  autoFocus
                  className="
                    h-12 w-full
                    rounded-full
                    border border-black/10
                    bg-transparent
                    pl-12 pr-4
                    text-sm
                    text-[var(--store-text-primary)]
                    outline-none transition
                    placeholder:opacity-50
                    focus:border-[#f16d59]
                    focus:ring-4
                    focus:ring-[#f16d59]/10
                    dark:border-white/10
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  h-12 shrink-0
                  rounded-full
                  bg-[#f16d59]
                  px-5 text-sm
                  font-semibold text-white
                  transition
                  hover:brightness-95
                "
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile category sheet */}
      {mobileCategoryOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close categories"
            onClick={() =>
              setMobileCategoryOpen(false)
            }
            className="
              absolute inset-0
              bg-black/45
              backdrop-blur-[2px]
            "
          />

          <section
            aria-label="Product categories"
            className="
              absolute inset-x-0
              bottom-[calc(4rem+env(safe-area-inset-bottom))]
              max-h-[70vh]
              overflow-hidden
              rounded-t-3xl
              border-t border-black/10
              bg-[var(--store-bg-1)]
              shadow-2xl
              dark:border-white/10
            "
          >
            <div
              className="
                flex items-center
                justify-between
                border-b border-black/10
                px-5 py-4
                dark:border-white/10
              "
            >
              <div>
                <p
                  className="
                    text-xs font-semibold
                    uppercase tracking-[0.18em]
                    text-[#f16d59]
                  "
                >
                  Browse
                </p>

                <h2
                  className="
                    mt-1 text-lg font-bold
                    text-[var(--store-text-primary)]
                  "
                >
                  Product Categories
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileCategoryOpen(false)
                }
                aria-label="Close categories"
                className="
                  grid h-10 w-10
                  place-items-center
                  rounded-full
                  border border-black/10
                  text-[var(--store-text-primary)]
                  transition
                  hover:border-[#f16d59]
                  hover:bg-[#f16d59]
                  hover:text-white
                  dark:border-white/10
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="
                max-h-[calc(70vh-81px)]
                overflow-y-auto
                px-4 py-4
              "
            >
              <button
                type="button"
                onClick={
                  handleAllProductsClick
                }
                className="
                  mb-2 flex w-full
                  items-center justify-between
                  rounded-xl
                  bg-[#f16d59]/10
                  px-3 py-3
                  text-left text-sm
                  font-semibold
                  text-[#f16d59]
                "
              >
                All Products

                <LayoutGrid className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                {categories?.length ? (
                  categories.map((item) => (
                    <MobileCategoryItem
                      key={item.category.id}
                      item={item}
                      onCategoryClick={
                        handleCategoryClick
                      }
                    />
                  ))
                ) : (
                  <p
                    className="
                      rounded-xl
                      border border-dashed
                      border-black/10
                      px-4 py-6
                      text-center text-sm
                      opacity-60
                      dark:border-white/10
                    "
                  >
                    No categories found.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav
        className="
          fixed inset-x-0 bottom-0
          z-[80]
          border-t border-black/10
          bg-[var(--store-bg-1)]/95
          pb-[env(safe-area-inset-bottom)]
          shadow-[0_-10px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          dark:border-white/10
          lg:hidden
        "
      >
        <div
          className="
            mx-auto grid h-16
            max-w-lg grid-cols-5
            px-1
          "
        >
          <MobileNavigationLink
            href="/store"
            label="Home"
            active={isActive("/store")}
          >
            <Home className="h-5 w-5" />
          </MobileNavigationLink>

          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);

              setMobileCategoryOpen(
                (previous) => !previous,
              );
            }}
            aria-label="Categories"
            aria-expanded={
              mobileCategoryOpen
            }
            className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
              mobileCategoryOpen ||
              productsActive
                ? "text-[#f16d59]"
                : "text-[var(--store-text-primary)] opacity-70 hover:text-[#f16d59] hover:opacity-100"
            }`}
          >
            <LayoutGrid className="h-5 w-5" />

            <span>Category</span>

            {(mobileCategoryOpen ||
              productsActive) && (
              <span
                className="
                  absolute bottom-0
                  h-0.5 w-8
                  rounded-full
                  bg-[#f16d59]
                "
              />
            )}
          </button>

          <MobileNavigationLink
            href="/store/dashboard/active-cart"
            label="Shopping"
            active={cartActive}
            count={cartCount}
          >
            <ShoppingBag className="h-5 w-5" />
          </MobileNavigationLink>

          <MobileNavigationLink
            href="/store/dashboard/wishlist"
            label="Wishlist"
            active={wishlistActive}
            count={favoriteCount}
          >
            <Heart className="h-5 w-5" />
          </MobileNavigationLink>

          <MobileNavigationLink
            href={userHref}
            label={user ? "Account" : "Login"}
            active={userActive}
          >
            <UserRound className="h-5 w-5" />
          </MobileNavigationLink>
        </div>
      </nav>
    </>
  );
};

export default CosmeticsNavbar;