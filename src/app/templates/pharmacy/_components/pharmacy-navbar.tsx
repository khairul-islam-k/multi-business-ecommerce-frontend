"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Armchair,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import { useCart } from "@/app/store/_components/contex/CartContex";
import { useAddActiveCArt } from "@/lib/api/hooks/add-cart";
import { useProductCategoryQuery } from "@/lib/api/hooks/public-website";
import type { FAQItem } from "@/types/website/website";

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

type CategoryImageProps = {
  item: CategoryTreeItem;
  size?: "small" | "medium";
};

const CategoryImage = ({
  item,
  size = "small",
}: CategoryImageProps) => {
  const image = item.category.imageUrl?.trim();

  const imageSize =
    size === "medium" ? "size-11" : "size-8";

  const iconSize =
    size === "medium" ? "size-5" : "size-4";

  if (!image) {
    return (
      <span
        className={`grid ${imageSize} shrink-0 place-items-center rounded-md bg-[var(--store-bg-2)]`}
      >
        <Armchair
          className={`${iconSize} text-gray-400`}
        />
      </span>
    );
  }

  return (
    <span
      className={`relative block ${imageSize} shrink-0 overflow-hidden rounded-md bg-[var(--store-bg-2)]`}
    >
      <Image
        src={imageUrlSet(image)}
        alt={item.category.name}
        fill
        sizes={size === "medium" ? "44px" : "32px"}
        className="object-contain p-1"
      />
    </span>
  );
};

const MobileCategoryItem = ({
  item,
  onCategoryClick,
}: {
  item: CategoryTreeItem;
  onCategoryClick: (categoryId: string) => void;
}) => {
  const hasChildren = item.children.length > 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() =>
          onCategoryClick(item.category.id)
        }
        className="flex w-full items-center gap-3 border-b border-[var(--store-border)] py-3.5 text-left text-sm font-medium text-[var(--store-text-primary)] transition hover:text-[var(--store-primary)]"
      >
        <CategoryImage
          item={item}
          size="medium"
        />

        <span>{item.category.name}</span>
      </button>
    );
  }

  return (
    <details className="group border-b border-[var(--store-border)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-sm font-medium text-[var(--store-text-primary)]">
        <span className="flex min-w-0 items-center gap-3">
          <CategoryImage
            item={item}
            size="medium"
          />

          <span className="truncate">
            {item.category.name}
          </span>
        </span>

        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="mb-3 ml-5 border-l border-[var(--store-border)] pl-4">
        <button
          type="button"
          onClick={() =>
            onCategoryClick(item.category.id)
          }
          className="block w-full py-2 text-left text-sm font-semibold text-[var(--store-primary)]"
        >
          View all {item.category.name}
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

const PharmacyNavbar = (
  _props: NavbarProps,
) => {
  const router = useRouter();
  const pathname = usePathname();

  const mobileSearchInputRef =
    useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [
    categoryNavbarVisible,
    setCategoryNavbarVisible,
  ] = useState(true);

  const [
    activeDesktopCategoryId,
    setActiveDesktopCategoryId,
  ] = useState<string | null>(null);

  const [
    activeDesktopChildId,
    setActiveDesktopChildId,
  ] = useState<string | null>(null);

  const { user } = useCart();

  const { data: categories } =
    useProductCategoryQuery();

  const { data: cart } = useAddActiveCArt();

  const cartCount = cart?.items?.length ?? 0;

  const categoryTree = useMemo<
    CategoryTreeItem[]
  >(
    () =>
      Array.isArray(categories)
        ? (categories as CategoryTreeItem[])
        : [],
    [categories],
  );

  const desktopNavigationCategories =
    useMemo(
      () => categoryTree.slice(0, 10),
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

  const activeDesktopChild = useMemo(() => {
    if (!activeDesktopCategory) {
      return null;
    }

    return (
      activeDesktopCategory.children.find(
        (item) =>
          item.category.id ===
          activeDesktopChildId,
      ) ??
      activeDesktopCategory.children[0] ??
      null
    );
  }, [
    activeDesktopCategory,
    activeDesktopChildId,
  ]);

  const isHomeActive = pathname === "/store";

  const isCartActive = pathname.startsWith(
    "/store/dashboard/active-cart",
  );

  const isAccountActive =
    pathname.startsWith("/store/dashboard") ||
    pathname.startsWith("/store/login");

  useEffect(() => {
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    setActiveDesktopCategoryId(null);
    setActiveDesktopChildId(null);
  }, [pathname]);

  /**
   * Focus the mobile search input after opening it.
   */
  useEffect(() => {
    if (!mobileSearchOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [mobileSearchOpen]);

  /**
   * Keep the main navbar visible.
   * Hide only the category navbar after scrolling.
   */
  
  useEffect(() => {
    const handleScroll = () => {
      const shouldShowCategoryNavbar =
        window.scrollY <= 0;

        console.log('scroll', window.scrollY);

      setCategoryNavbarVisible(
        shouldShowCategoryNavbar,
      );

      if (!shouldShowCategoryNavbar) {
        setActiveDesktopCategoryId(null);
        setActiveDesktopChildId(null);
      }
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

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
    setMobileSearchOpen(false);
    setActiveDesktopCategoryId(null);
    setActiveDesktopChildId(null);

    router.push(getCategoryHref(categoryId));
  };

  const handleDesktopCategoryEnter = (
    item: CategoryTreeItem,
  ) => {
    setActiveDesktopCategoryId(
      item.category.id,
    );

    setActiveDesktopChildId(
      item.children[0]?.category.id ?? null,
    );
  };

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = searchValue.trim();

    setMobileSearchOpen(false);

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

  const handleMobileSearchToggle = () => {
    setMobileMenuOpen(false);

    setMobileSearchOpen((previous) => !previous);
  };

  return (
    <>
      <header className="sticky top-0 z-[70] bg-[var(--store-bg-1)] shadow-sm">
        {/* Main navbar */}
        <div className="border-b border-[var(--store-border)]">
          <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-6">
            <div className="flex h-16 items-center gap-4 lg:h-[78px] lg:gap-7">
              {/* Logo */}
              <Link
                href="/store"
                aria-label="Go to store home"
                className="shrink-0"
              >
                <LogoComponent />
              </Link>

              {/* Desktop search */}
              <div className="hidden flex-1 justify-center lg:flex">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex h-12 w-full max-w-[520px] overflow-hidden rounded-xl border border-[var(--store-border)] bg-[var(--store-bg-1)] focus-within:border-[var(--store-primary)]"
                >
                  <span className="grid w-12 shrink-0 place-items-center text-[var(--store-text-secondary)]">
                    <Search className="size-5" />
                  </span>

                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) =>
                      setSearchValue(event.currentTarget.value)
                    }
                    placeholder='Search "Products"'
                    aria-label="Search products"
                    className="min-w-0 flex-1 bg-transparent pr-3 text-sm text-[var(--store-text-primary)] outline-none placeholder:text-[var(--store-text-secondary)]"
                  />

                  <button
                    type="submit"
                    className="min-w-24 shrink-0 bg-[var(--store-accent)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Mobile actions */}
              <div className="ml-auto flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  onClick={handleMobileSearchToggle}
                  aria-label={
                    mobileSearchOpen
                      ? "Close product search"
                      : "Open product search"
                  }
                  aria-expanded={mobileSearchOpen}
                  className={`grid size-10 place-items-center rounded-md transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${mobileSearchOpen
                      ? "bg-[var(--store-bg-2)] text-[var(--store-primary)]"
                      : "text-[var(--store-text-primary)]"
                    }`}
                >
                  {mobileSearchOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Search className="size-5" />
                  )}
                </button>

                <Link
                  href={
                    user
                      ? "/store/dashboard"
                      : "/store/login"
                  }
                  aria-label={
                    user
                      ? "Open account"
                      : "Login"
                  }
                  className={`grid size-10 place-items-center rounded-md transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isAccountActive
                      ? "text-[var(--store-primary)]"
                      : "text-[var(--store-text-primary)]"
                    }`}
                >
                  <UserRound className="size-5" />
                </Link>

                <Link
                  href="/store/dashboard/active-cart"
                  aria-label="Open shopping cart"
                  className={`relative grid size-10 place-items-center rounded-md transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isCartActive
                      ? "text-[var(--store-primary)]"
                      : "text-[var(--store-text-primary)]"
                    }`}
                >
                  <ShoppingCart className="size-5" />

                  {cartCount > 0 && (
                    <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold leading-none text-white">
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Desktop account and cart */}
              <div className="hidden shrink-0 items-center gap-3 lg:flex">
                <Link
                  href={
                    user
                      ? "/store/dashboard"
                      : "/store/login"
                  }
                  className={`flex min-w-[112px] items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isAccountActive
                      ? "text-[var(--store-primary)]"
                      : "text-[var(--store-text-primary)]"
                    }`}
                >
                  <UserRound className="size-7 shrink-0" />

                  <span className="leading-tight">
                    <span className="block text-xs text-[var(--store-text-secondary)]">
                      Account
                    </span>

                    <span className="block text-sm font-semibold">
                      {user
                        ? "My Account"
                        : "Login"}
                    </span>
                  </span>
                </Link>

                <Link
                  href="/store/dashboard/active-cart"
                  className={`flex min-w-[105px] items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isCartActive
                      ? "text-[var(--store-primary)]"
                      : "text-[var(--store-text-primary)]"
                    }`}
                >
                  <span className="relative">
                    <ShoppingCart className="size-7" />

                    {cartCount > 0 && (
                      <span className="absolute -right-2.5 -top-2.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold leading-none text-white">
                        {cartCount > 99
                          ? "99+"
                          : cartCount}
                      </span>
                    )}
                  </span>

                  <span className="leading-tight">
                    <span className="block text-xs text-[var(--store-text-secondary)]">
                      Cart
                    </span>

                    <span className="block text-sm font-semibold">
                      {cartCount}{" "}
                      {cartCount === 1
                        ? "item"
                        : "items"}
                    </span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile search input */}
            <div
              className={`overflow-hidden transition-[max-height,opacity,padding] duration-300 lg:hidden ${mobileSearchOpen
                  ? "max-h-24 pb-3 opacity-100"
                  : "pointer-events-none max-h-0 pb-0 opacity-0"
                }`}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="flex h-11 overflow-hidden rounded-lg border border-[var(--store-border)] bg-[var(--store-bg-1)] focus-within:border-[var(--store-primary)]"
              >
                <span className="grid w-11 shrink-0 place-items-center text-[var(--store-text-secondary)]">
                  <Search className="size-4" />
                </span>

                <input
                  ref={mobileSearchInputRef}
                  type="search"
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(
                      event.currentTarget.value,
                    )
                  }
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent pr-2 text-sm text-[var(--store-text-primary)] outline-none placeholder:text-[var(--store-text-secondary)]"
                />

                <button
                  type="submit"
                  className="shrink-0 bg-[var(--store-primary)] px-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Category navbar */}
        <div
          className={`relative bg-[var(--store-bg-1)] transition-[max-height,opacity,transform] duration-300 ${categoryNavbarVisible
              ? "max-h-14 translate-y-0 overflow-visible opacity-100"
              : "pointer-events-none max-h-0 -translate-y-3 overflow-hidden opacity-0"
            }`}
          onMouseLeave={() => {
            setActiveDesktopCategoryId(null);
            setActiveDesktopChildId(null);
          }}
        >
          <nav className="border-b border-[var(--store-border)]">
            <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-7 lg:px-6">
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(false);
                  setMobileMenuOpen(true);
                }}
                className="flex shrink-0 items-center gap-2 rounded-md bg-[var(--store-bg-2)] px-3 py-2 text-sm font-semibold text-[var(--store-text-primary)] lg:hidden"
              >
                <Menu className="size-4" />
                Categories
              </button>

              <Link
                href="/store"
                onMouseEnter={() => {
                  setActiveDesktopCategoryId(
                    null,
                  );
                  setActiveDesktopChildId(null);
                }}
                className={`relative flex h-full shrink-0 items-center px-1 text-sm font-medium transition hover:text-[var(--store-primary)] ${isHomeActive
                    ? "text-[var(--store-primary)]"
                    : "text-[var(--store-text-primary)]"
                  }`}
              >
                Home

                {isHomeActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--store-primary)]" />
                )}
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
                          item,
                        )
                      }
                      onFocus={() =>
                        handleDesktopCategoryEnter(
                          item,
                        )
                      }
                      onClick={() => {
                        setActiveDesktopCategoryId(
                          null,
                        );
                        setActiveDesktopChildId(
                          null,
                        );
                      }}
                      className={`relative flex h-full shrink-0 items-center px-1 text-sm font-medium transition ${isOpen
                          ? "text-[var(--store-primary)]"
                          : "text-[var(--store-text-primary)] hover:text-[var(--store-primary)]"
                        }`}
                    >
                      {item.category.name}

                      {isOpen && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--store-primary)]" />
                      )}
                    </Link>
                  );
                },
              )}
            </div>
          </nav>

          {/* Desktop category mega menu */}
          {activeDesktopCategory && (
            <div className="absolute left-1/2 top-full z-[90] hidden w-[680px] -translate-x-1/2 overflow-hidden rounded-b-xl border border-t-0 border-[var(--store-border)] bg-[var(--store-bg-1)] shadow-2xl lg:grid lg:grid-cols-[280px_1fr]">
              <div className="border-r border-[var(--store-border)] p-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCategoryClick(
                      activeDesktopCategory
                        .category.id,
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                >
                  <CategoryImage
                    item={activeDesktopCategory}
                  />

                  <span className="flex-1">
                    All
                  </span>
                </button>

                {activeDesktopCategory.children.map(
                  (child) => {
                    const isChildActive =
                      activeDesktopChild?.category
                        .id === child.category.id;

                    return (
                      <button
                        key={child.category.id}
                        type="button"
                        onMouseEnter={() =>
                          setActiveDesktopChildId(
                            child.category.id,
                          )
                        }
                        onFocus={() =>
                          setActiveDesktopChildId(
                            child.category.id,
                          )
                        }
                        onClick={() =>
                          handleCategoryClick(
                            child.category.id,
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${isChildActive
                            ? "bg-[var(--store-bg-2)] font-semibold text-[var(--store-primary)]"
                            : "text-[var(--store-text-primary)] hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                          }`}
                      >
                        <CategoryImage
                          item={child}
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {child.category.name}
                        </span>

                        <ChevronRight className="size-4 shrink-0" />
                      </button>
                    );
                  },
                )}
              </div>

              <div className="p-3">
                {activeDesktopChild ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleCategoryClick(
                          activeDesktopChild
                            .category.id,
                        )
                      }
                      className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                    >
                      <span>
                        All{" "}
                        {
                          activeDesktopChild
                            .category.name
                        }
                      </span>

                      <ChevronRight className="size-4" />
                    </button>

                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {activeDesktopChild.children
                        .length > 0 ? (
                        activeDesktopChild.children.map(
                          (child) => (
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
                              className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                            >
                              <CategoryImage
                                item={child}
                              />

                              <span className="line-clamp-2">
                                {
                                  child.category
                                    .name
                                }
                              </span>
                            </button>
                          ),
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleCategoryClick(
                              activeDesktopChild
                                .category.id,
                            )
                          }
                          className="col-span-full flex items-center gap-3 rounded-lg px-3 py-4 text-left text-sm text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                        >
                          <CategoryImage
                            item={
                              activeDesktopChild
                            }
                            size="medium"
                          />

                          Browse{" "}
                          {
                            activeDesktopChild
                              .category.name
                          }
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryClick(
                        activeDesktopCategory
                          .category.id,
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-4 text-left text-sm text-[var(--store-text-primary)] transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                  >
                    <CategoryImage
                      item={activeDesktopCategory}
                      size="medium"
                    />

                    Browse{" "}
                    {
                      activeDesktopCategory
                        .category.name
                    }
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
      </header>

      {/* Mobile drawer overlay */}
      <button
        type="button"
        aria-label="Close category menu"
        onClick={() =>
          setMobileMenuOpen(false)
        }
        className={`fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300 lg:hidden ${mobileMenuOpen
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
        className={`fixed left-0 top-0 z-[100] flex h-dvh w-[88%] max-w-sm flex-col bg-[var(--store-bg-1)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--store-border)] px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
          <div>
            <p className="text-lg font-semibold text-[var(--store-text-primary)]">
              Categories
            </p>

            <p className="text-xs text-[var(--store-text-secondary)]">
              Browse all product categories
            </p>
          </div>

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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          <Link
            href="/store/products"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex items-center justify-between border-b border-[var(--store-border)] py-4 text-sm font-semibold text-[var(--store-primary)]"
          >
            View all products

            <ChevronRight className="size-4" />
          </Link>

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
            <p className="py-10 text-center text-sm text-[var(--store-text-secondary)]">
              No categories found.
            </p>
          )}
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-[var(--store-border)] px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <Link
            href={
              user
                ? "/store/dashboard"
                : "/store/login"
            }
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="flex items-center justify-center gap-2 rounded-lg border border-[var(--store-border)] px-3 py-3 text-sm font-medium text-[var(--store-text-primary)]"
          >
            <UserRound className="size-4" />

            {user ? "Account" : "Login"}
          </Link>

          <Link
            href="/store/dashboard/active-cart"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="relative flex items-center justify-center gap-2 rounded-lg border border-[var(--store-border)] px-3 py-3 text-sm font-medium text-[var(--store-text-primary)]"
          >
            <ShoppingCart className="size-4" />

            Cart

            {cartCount > 0 && (
              <span className="grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--store-primary)] px-1 text-[9px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default PharmacyNavbar;