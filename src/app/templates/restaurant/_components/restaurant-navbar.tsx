"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Home,
  LayoutGrid,
  LogIn,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useCart } from "@/app/store/_components/contex/CartContex";
import StoreThemeToggle from "@/app/store/_components/store-theme-switcher";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import {
  useProductCategoryQuery,
} from "@/lib/api/hooks/public-website";
import { useTemplateProductWishListQuery } from "@/lib/api/hooks/template-product-wishList";
import { FAQItem } from "@/types/website/website";

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

type IconButtonProps = {
  href: string;
  label: string;
  count?: number;
  children: ReactNode;
};

const IconButton = ({
  href,
  label,
  count,
  children,
}: IconButtonProps) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid size-10 place-items-center rounded-full border border-transparent text-gray-700 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white dark:text-gray-200"
    >
      {children}

      {typeof count === "number" &&
        count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
    </Link>
  );
};

type CategoryMenuItemProps = {
  item: CategoryTreeItem;
  onCategoryClick: (
    categoryId: string,
  ) => void;
};

const CategoryMenuItem = ({
  item,
  onCategoryClick,
}: CategoryMenuItemProps) => {
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
        className="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-[#f16d59]/10 hover:text-[#f16d59] dark:text-gray-200 dark:hover:bg-[#f16d59]/15"
      >
        <span className="line-clamp-1">
          {item.category.name}
        </span>

        {hasChildren && (
          <ChevronDown className="size-4 shrink-0 -rotate-90 text-gray-400" />
        )}
      </button>

      {hasChildren && open && (
        <div className="absolute left-full top-0 z-[80] w-64 pl-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            {item.children.map(
              (child) => (
                <CategoryMenuItem
                  key={child.category.id}
                  item={child}
                  onCategoryClick={
                    onCategoryClick
                  }
                />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
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
    Array.isArray(item.children) &&
    item.children.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-[#f16d59]/10 hover:text-[#f16d59] dark:text-gray-200"
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#f16d59]/10 hover:text-[#f16d59] dark:text-gray-200">
        <span>{item.category.name}</span>

        <ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" />
      </summary>

      <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#f16d59]/40 pl-3">
        <button
          type="button"
          onClick={() =>
            onCategoryClick(
              item.category.id,
            )
          }
          className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#f16d59] transition hover:bg-[#f16d59]/10"
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

const RestaurantNavbar = ({
  faqs,
  privacy,
  terms,
}: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileCategoryOpen, setMobileCategoryOpen] =
    useState(false);

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

  const hasFaqs =
    Array.isArray(faqs) &&
    faqs.length > 0;

  const pageLinks: Array<{
    label: string;
    href: string;
  }> = [
    ...(privacy
      ? [
          {
            label: "Privacy Policy",
            href: "/store/privacy",
          },
        ]
      : []),

    ...(terms
      ? [
          {
            label:
              "Terms & Conditions",
            href:
              "/store/term-condition",
          },
        ]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/store") {
      return pathname === "/store";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`,
      )
    );
  };

  const categoryActive =
    isActive("/store/products");

  const pagesActive =
    pageLinks.some((link) =>
      isActive(link.href),
    );

  const accountHref = user
    ? "/store/dashboard"
    : "/store/login";

  const accountActive =
    isActive("/store/login") ||
    isActive("/store/dashboard");

  const handleCategoryClick = (
    categoryId: string,
  ) => {
    setMobileCategoryOpen(false);

    router.push(
      `/store/products?categoryId=${categoryId}`,
    );
  };

  const desktopLinkClass = (
    href: string,
  ) => {
    return [
      "relative text-sm font-semibold transition-colors duration-300",
      "hover:text-[#f16d59]",
      isActive(href)
        ? "text-[#f16d59]"
        : "text-gray-700 dark:text-gray-200",
    ].join(" ");
  };

  const bottomItemClass = (
    active: boolean,
  ) => {
    return [
      "relative flex min-w-0 flex-col items-center justify-center gap-1",
      "rounded-xl px-1 py-2 text-[10px] font-semibold transition-all duration-300",
      active
        ? "bg-[#f16d59]/10 text-[#f16d59]"
        : "text-gray-500 hover:text-[#f16d59] dark:text-gray-400",
    ].join(" ");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--store-bg-1)]/95 backdrop-blur-xl dark:border-white/10">
        <nav className="mx-auto grid h-20 grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* Left logo */}
          <div className="min-w-0 justify-self-start">
            <LogoComponent />
          </div>

          {/* Desktop center navigation */}
          <div className="hidden items-center justify-center gap-8 lg:flex">
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
                <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
              )}
            </Link>

            {/* Category dropdown */}
            <div className="group relative">
              <button
                type="button"
                className={[
                  "relative flex items-center gap-1 text-sm font-semibold transition-colors duration-300",
                  "hover:text-[#f16d59]",
                  categoryActive
                    ? "text-[#f16d59]"
                    : "text-gray-700 dark:text-gray-200",
                ].join(" ")}
              >
                Category

                <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />

                {categoryActive && (
                  <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
                )}
              </button>

              <div className="invisible absolute left-1/2 top-full z-[70] w-72 -translate-x-1/2 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
                  <Link
                    href="/store/products"
                    className="mb-2 flex items-center justify-between rounded-xl bg-[#f16d59]/10 px-4 py-3 text-sm font-semibold text-[#f16d59] transition hover:bg-[#f16d59] hover:text-white"
                  >
                    View All Categories

                    <LayoutGrid className="size-4" />
                  </Link>

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
                    <p className="px-4 py-5 text-center text-sm text-gray-500">
                      No categories found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pages */}
            {pageLinks.length > 0 && (
              <div className="group relative">
                <button
                  type="button"
                  className={[
                    "relative flex items-center gap-1 text-sm font-semibold transition-colors duration-300",
                    "hover:text-[#f16d59]",
                    pagesActive
                      ? "text-[#f16d59]"
                      : "text-gray-700 dark:text-gray-200",
                  ].join(" ")}
                >
                  Pages

                  <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />

                  {pagesActive && (
                    <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
                  )}
                </button>

                <div className="invisible absolute left-1/2 top-full z-[70] w-64 -translate-x-1/2 pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
                    {pageLinks.map(
                      (link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={[
                            "block rounded-xl px-4 py-3 text-sm font-medium transition",
                            isActive(
                              link.href,
                            )
                              ? "bg-[#f16d59]/10 text-[#f16d59]"
                              : "text-gray-700 hover:bg-[#f16d59]/10 hover:text-[#f16d59] dark:text-gray-200",
                          ].join(" ")}
                        >
                          {link.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {hasFaqs && (
              <Link
                href="/store/faq"
                className={desktopLinkClass(
                  "/store/faq",
                )}
              >
                FAQ

                {isActive(
                  "/store/faq",
                ) && (
                  <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
                )}
              </Link>
            )}

            <Link
              href="/store/contact"
              className={desktopLinkClass(
                "/store/contact",
              )}
            >
              Contact Us

              {isActive(
                "/store/contact",
              ) && (
                <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#f16d59]" />
              )}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-end gap-2 justify-self-end">
            {/* Desktop wishlist */}
            <div className="hidden lg:block">
              <IconButton
                href="/store/dashboard/wishlist"
                label="Wishlist"
                count={favoriteCount}
              >
                <Heart className="size-5" />
              </IconButton>
            </div>

            {/* Desktop cart */}
            <div className="hidden lg:block">
              <IconButton
                href="/store/dashboard/active-cart"
                label="Shopping cart"
                count={cartCount}
              >
                <ShoppingBag className="size-5" />
              </IconButton>
            </div>

            {/* Desktop and mobile theme */}
            <StoreThemeToggle />

            {/* Login or user */}
            {user ? (
              <AvatarDropdown />
            ) : (
              <Link
                href="/store/login"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#f16d59] px-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-950"
              >
                <LogIn className="hidden size-4 sm:block" />

                <span>Login</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile category overlay */}
      {mobileCategoryOpen && (
        <>
          <button
            type="button"
            aria-label="Close category menu"
            onClick={() =>
              setMobileCategoryOpen(false)
            }
            className="fixed inset-x-0 bottom-[76px] top-20 z-[60] bg-black/45 backdrop-blur-[2px] lg:hidden"
          />

          <aside className="fixed inset-x-3 bottom-[88px] top-24 z-[70] flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950 lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f16d59]">
                  Our Menu
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-950 dark:text-white">
                  Food Categories
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileCategoryOpen(
                    false,
                  )
                }
                aria-label="Close categories"
                className="grid size-10 place-items-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-[#f16d59] hover:text-white dark:bg-white/10 dark:text-gray-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Link
                href="/store/products"
                onClick={() =>
                  setMobileCategoryOpen(
                    false,
                  )
                }
                className="mb-3 flex items-center justify-between rounded-2xl bg-[#f16d59] px-4 py-3.5 text-sm font-semibold text-white"
              >
                View All Categories

                <LayoutGrid className="size-5" />
              </Link>

              <div className="space-y-1">
                {categories?.length ? (
                  categories.map((item) => (
                    <MobileCategoryItem
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
                  <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-white/15">
                    No categories found.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Mobile fixed bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-gray-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {/* Home */}
          <Link
            href="/store"
            onClick={() =>
              setMobileCategoryOpen(false)
            }
            className={bottomItemClass(
              isActive("/store"),
            )}
          >
            <Home className="size-5" />
            <span>Home</span>
          </Link>

          {/* Category */}
          <button
            type="button"
            onClick={() =>
              setMobileCategoryOpen(
                (previous) => !previous,
              )
            }
            className={bottomItemClass(
              categoryActive ||
                mobileCategoryOpen,
            )}
            aria-label="Open categories"
            aria-expanded={
              mobileCategoryOpen
            }
          >
            <LayoutGrid className="size-5" />
            <span>Category</span>
          </button>

          {/* Cart */}
          <Link
            href="/store/dashboard/active-cart"
            onClick={() =>
              setMobileCategoryOpen(false)
            }
            className={bottomItemClass(
              isActive(
                "/store/dashboard/active-cart",
              ),
            )}
          >
            <span className="relative">
              <ShoppingBag className="size-5" />

              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#f16d59] px-1 text-[9px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </span>

            <span>Cart</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/store/dashboard/wishlist"
            onClick={() =>
              setMobileCategoryOpen(false)
            }
            className={bottomItemClass(
              isActive(
                "/store/dashboard/wishlist",
              ),
            )}
          >
            <span className="relative">
              <Heart className="size-5" />

              {favoriteCount > 0 && (
                <span className="absolute -right-3 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#f16d59] px-1 text-[9px] font-bold text-white">
                  {favoriteCount > 99
                    ? "99+"
                    : favoriteCount}
                </span>
              )}
            </span>

            <span>Wishlist</span>
          </Link>

          {/* Login/account */}
          <Link
            href={accountHref}
            onClick={() =>
              setMobileCategoryOpen(false)
            }
            className={bottomItemClass(
              accountActive,
            )}
          >
            {user ? (
              <UserRound className="size-5" />
            ) : (
              <LogIn className="size-5" />
            )}

            <span>
              {user
                ? "Account"
                : "Login"}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default RestaurantNavbar;