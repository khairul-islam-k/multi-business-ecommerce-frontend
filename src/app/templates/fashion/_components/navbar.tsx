"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useResolveWebsite } from "@/lib/api/hooks/template-resolve";
import Image from "next/image";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";

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
    href: "/contact",
  },
  {
    label: "Privacy & Policy",
    href: "/privacy-policy",
  },
  {
    label: "Term & Condition",
    href: "/terms-condition",
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

      {typeof count === "number" && (
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
        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-white hover:text-[#f16d59]"
      >
        {item.category.name}
      </button>
    );
  }

  return (
    <details>
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white">
        {item.category.name}
        <ChevronDown className="h-4 w-4" />
      </summary>

      <div className="mt-2 space-y-1 border-l-2 border-[#f16d59] pl-3">
        <button
          type="button"
          onClick={() => onCategoryClick(item.category.id)}
          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-white hover:text-[#f16d59]"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useCart();

  const { data: categories } = useProductCategoryQuery();
  const { data: cart } = useAddActiveCArt();
  const { data: wishList } = useTemplateProductWishListQuery();
  const { data: resolve } = useResolveWebsite();

  console.log('resolve', resolve?.name);

  const logoUrl = resolve?.theme?.logoUrl ?? '';
  const cartCount = cart?.items.length ?? 0;
  const compareCount = 2;
  const favoriteCount = wishList?.meta.total ?? 0;

  const handleCategoryClick = (categoryId: string) => {
    console.log("Clicked category id:", categoryId);

    setMobileMenuOpen(false);

    router.push(`/store/products?categoryId=${categoryId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--store-bg-1)]">
        <nav className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* Logo */}
          {
            logoUrl ? <div className="flex items-center">
              <Image
                src={imageUrlSet(logoUrl)}
                width={200}
                height={50}
                alt="logo"
                className="object-contain w-[200px] h-[45px]"
              />
            </div> :

              <div className="flex items-center">
                <Link href="/store" className="text-2xl font-bold">
                  Fashion Store
                </Link>
              </div>
          }

          {/* Center Navigation */}
          <div className="hidden items-center justify-center gap-8 lg:flex">
            <Link
              href={`/store`}
              className="text-sm font-medium transition hover:text-[#f16d59]"
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium transition hover:text-[#f16d59]"
              >
                Products
                <ChevronDown className="h-4 w-4 transition duration-300 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="rounded-xl  bg-white p-2 shadow-xl">
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

            {/* Pages Dropdown */}
            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium transition hover:text-[#f16d59]"
              >
                Pages
                <ChevronDown className="h-4 w-4 transition duration-300 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {pageLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-[#f16d59]/10 hover:text-[#f16d59]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/faq"
              className="text-sm font-medium transition hover:text-[#f16d59]"
            >
              FAQ
            </Link>

            <Link
              href="/store/contact"
              className="text-sm font-medium transition hover:text-[#f16d59]"
            >
              Contact Us
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center justify-end gap-2">
            <IconButton
              href="/search"
              label="Search"
              className="hidden lg:grid"
            >
              <Search className="h-5 w-5" />
            </IconButton>

            {/* <IconButton
              href="/compare"
              label="Compare"
              count={compareCount}
              className="hidden lg:grid"
            >
              <GitCompareArrows className="h-5 w-5" />
            </IconButton> */}

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
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-900 transition-all duration-300 hover:border-[#f16d59] hover:bg-[#f16d59] hover:text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
            <div className="space-y-2">
              <Link
                href={`/store`}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#f16d59]"
              >
                Home
              </Link>

              <details>
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Products
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

              <details>
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Pages
                  <ChevronDown className="h-4 w-4" />
                </summary>

                <div className="mt-2 space-y-1 rounded-xl bg-gray-50 p-3">
                  {pageLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-[#f16d59]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </details>

              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#f16d59]"
              >
                FAQ
              </Link>

              <Link
                href="/store/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#f16d59]"
              >
                Contact Us
              </Link>

              {/* Mobile Open Icons */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-4 gap-3">
                  <Link
                    href="/search"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-xs font-medium text-gray-700 hover:border-[#f16d59] hover:text-[#f16d59]"
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </Link>

                  <Link
                    href="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-xs font-medium text-gray-700 hover:border-[#f16d59] hover:text-[#f16d59]"
                  >
                    <GitCompareArrows className="h-5 w-5" />
                    Compare
                    <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
                      {compareCount}
                    </span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-xs font-medium text-gray-700 hover:border-[#f16d59] hover:text-[#f16d59]"
                  >
                    <Heart className="h-5 w-5" />
                    Favorite
                    <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
                      {favoriteCount}
                    </span>
                  </Link>

                  <Link
                    href="/store/dashboard/active-cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-950 bg-gray-950 py-3 text-xs font-medium text-white"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Cart
                    <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#f16d59] px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  </Link>
                </div>

                <Link
                  href="/store/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f16d59] px-5 text-sm font-semibold text-white transition hover:bg-gray-950"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default FashionNavbar;
