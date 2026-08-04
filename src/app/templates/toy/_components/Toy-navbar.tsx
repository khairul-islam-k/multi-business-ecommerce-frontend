"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Armchair,
    ChevronDown,
    Grid2X2,
    Heart,
    Home,
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
import StoreThemeToggle from "@/app/store/_components/store-theme-switcher";

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


type FlatCategoryItem = {
    item: CategoryTreeItem;
    depth: number;
};

const flattenCategoryTree = (
    items: CategoryTreeItem[],
    depth = 0,
): FlatCategoryItem[] => {
    return items.flatMap((item) => [
        { item, depth },
        ...flattenCategoryTree(
            item.children,
            depth + 1,
        ),
    ]);
};


type NavbarSearchProps = {
    onSearch: (value: string) => void;
    autoFocus?: boolean;
    className?: string;
};

const NavbarSearch = ({
    onSearch,
    autoFocus = false,
    className = "",
}: NavbarSearchProps) => {
    const [value, setValue] = useState("");

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        onSearch(value);
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={`flex h-11 w-full items-center overflow-hidden border border-[var(--store-border)] bg-[var(--store-bg-2)] transition focus-within:border-[var(--store-primary)] focus-within:ring-2 focus-within:ring-[var(--store-primary)]/15 ${className}`}
        >
            <Search className="ml-4 text-[var(--store-text)] size-4 shrink-0" />

            <input
                type="search"
                value={value}
                onChange={(event) =>
                    setValue(event.target.value)
                }
                autoFocus={autoFocus}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-full min-w-0 flex-1 bg-[var(--store-bg-1)] px-3 text-[var(--store-text)] placeholder:text-gray-500 outline-none"
            />

            {value && (
                <button
                    type="button"
                    onClick={() => setValue("")}
                    aria-label="Clear search"
                    className="grid size-9 shrink-0 place-items-center text-[var(--store-text-secondary)] transition hover:text-[var(--store-text-primary)]"
                >
                    <X className="size-4" />
                </button>
            )}

            <button
                type="submit"
                aria-label="Submit search"
                className="mr-1 grid size-9 shrink-0 place-items-center rounded-full bg-[var(--store-primary)] text-white transition hover:opacity-90"
            >
                <Search className="size-4" />
            </button>
        </form>
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

const ToyNavbar = ({
    phone
}: NavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const desktopCategoryRef = useRef<HTMLDivElement>(null);


    const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
    const [desktopCategoryMenuOpen, setDesktopCategoryMenuOpen] =
        useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryNavbarVisible, setCategoryNavbarVisible] = useState(true);

    const touchStartYRef = useRef<number | null>(null);

    const { user } = useCart();

    const { data: categories } = useProductCategoryQuery();

    const { data: cart } = useAddActiveCArt();

    const { data: wishList } = useTemplateProductWishListQuery();

    const cartCount = cart?.items?.length ?? 0;
    const favoriteCount = wishList?.meta?.total ?? 0;

    const phoneNumber = phone?.trim() || "+880 1234-567890";

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

    const flattenedCategoryItems = useMemo(
        () => flattenCategoryTree(categoryTree),
        [categoryTree],
    );

    const isHomeActive = pathname === "/store";

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
        setDesktopCategoryMenuOpen(false);
        setCategoryNavbarVisible(true);
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
     * Close the desktop category dropdown when clicking
     * outside it or pressing Escape.
     */
    useEffect(() => {
        if (!desktopCategoryMenuOpen) {
            return;
        }

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;

            if (!desktopCategoryRef.current?.contains(target)) {
                setDesktopCategoryMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setDesktopCategoryMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [desktopCategoryMenuOpen]);

    /**
     * Hide the second desktop navbar on any downward scroll
     * and show it on any upward scroll.
     *
     * Wheel/touch/keyboard direction is used instead of comparing
     * window.scrollY. This prevents layout changes from causing
     * the navbar to vibrate between hidden and visible states.
     */
    useEffect(() => {
        const hideCategoryNavbar = () => {
            setCategoryNavbarVisible(false);
            setDesktopCategoryMenuOpen(false);
        };

        const showCategoryNavbar = () => {
            setCategoryNavbarVisible(true);
        };

        const isInsideDesktopCategoryMenu = (
            target: EventTarget | null,
        ) => {
            console.log('target', target instanceof Node)

            if (
                !desktopCategoryMenuOpen ||
                !(target instanceof Node)
            ) {
                return false;
            }

            return Boolean(
                desktopCategoryRef.current?.contains(
                    target,
                ),
            );
        };

        const handleWheel = (event: WheelEvent) => {
            // Scrolling inside the desktop category dropdown
            // should scroll the list, not hide the navbar.
            if (
                isInsideDesktopCategoryMenu(
                    event.target,
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

        const handleTouchStart = (event: TouchEvent) => {
            touchStartYRef.current =
                event.touches[0]?.clientY ?? null;
        };

        const handleTouchMove = (event: TouchEvent) => {
            // Keep touch scrolling inside an opened desktop
            // category dropdown independent from navbar visibility.
            if (
                isInsideDesktopCategoryMenu(
                    event.target,
                )
            ) {
                touchStartYRef.current =
                    event.touches[0]?.clientY ?? null;
                return;
            }

            const currentTouchY =
                event.touches[0]?.clientY;
            const previousTouchY =
                touchStartYRef.current;

            if (
                currentTouchY === undefined ||
                previousTouchY === null
            ) {
                return;
            }

            // Finger moves upward: page scrolls downward.
            if (currentTouchY < previousTouchY) {
                hideCategoryNavbar();
            } else if (currentTouchY > previousTouchY) {
                // Finger moves downward: page scrolls upward.
                showCategoryNavbar();
            }

            touchStartYRef.current = currentTouchY;
        };

        const handleTouchEnd = () => {
            touchStartYRef.current = null;
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const activeElement = document.activeElement;
            console.log('active', activeElement instanceof HTMLTextAreaElement)
            
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
            if (
                desktopCategoryMenuOpen &&
                activeElement instanceof Node &&
                desktopCategoryRef.current?.contains(
                    activeElement,
                )
            ) {
                return;
            }

            if (
                event.key === "ArrowDown" ||
                event.key === "PageDown" ||
                event.key === "End" ||
                event.key === " "
            ) {
                hideCategoryNavbar();
                return;
            }

            if (
                event.key === "ArrowUp" ||
                event.key === "PageUp" ||
                event.key === "Home"
            ) {
                console.log('show')
                showCategoryNavbar();
            }
        };

        window.addEventListener("wheel", handleWheel, {
            passive: true,
        });
        window.addEventListener(
            "touchstart",
            handleTouchStart,
            { passive: true },
        );
        window.addEventListener(
            "touchmove",
            handleTouchMove,
            { passive: true },
        );
        window.addEventListener(
            "touchend",
            handleTouchEnd,
            { passive: true },
        );
        window.addEventListener(
            "touchcancel",
            handleTouchEnd,
            { passive: true },
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
                "touchstart",
                handleTouchStart,
            );
            window.removeEventListener(
                "touchmove",
                handleTouchMove,
            );
            window.removeEventListener(
                "touchend",
                handleTouchEnd,
            );
            window.removeEventListener(
                "touchcancel",
                handleTouchEnd,
            );
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [desktopCategoryMenuOpen]);

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
        setDesktopCategoryMenuOpen(false);

        router.push(getCategoryHref(categoryId));
    };

    const handleSearch = (value: string) => {
        const searchValue = value.trim();

        if (!searchValue) {
            router.push("/store/products");
            return;
        }

        router.push(
            `/store/products?search=${encodeURIComponent(searchValue)}`,
        );
    };

    return (
        <>
            <header className="sticky top-0 z-[60] bg-[var(--store-bg-1)]">
                {/* Desktop main header */}
                <div className="hidden text-[var(--store-navbar-text)] bg-[var(--store-navbar-bg)] border-b border-[var(--store-border)] lg:block">
                    <div className="mx-auto grid h-[82px] w-full grid-cols-[1fr_minmax(280px,480px)_1fr] items-center gap-6 px-4 xl:px-6">
                        {/* Logo */}
                        <div className="flex min-w-0 items-center justify-start">
                            <LogoComponent
                            />
                        </div>

                        {/* Search */}
                        <div className="mx-auto w-full max-w-[480px]">
                            <NavbarSearch
                                onSearch={handleSearch}
                            />
                        </div>

                        {/* Right actions */}
                        <div className="flex min-w-0 items-center justify-end gap-3">
                            <StoreThemeToggle />

                            <Link
                                href="/store/dashboard/wishlist"
                                aria-label="Wishlist"
                                className={`relative grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isWishlistActive
                                    ? "text-[var(--store-primary)]"
                                    : "text-[var(--store-text-primary)]"
                                    }`}
                            >
                                <Heart className="size-5" />

                                {favoriteCount > 0 && (
                                    <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                                        {favoriteCount > 9
                                            ? "9+"
                                            : favoriteCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/store/dashboard/active-cart"
                                aria-label="Shopping cart"
                                className={`relative grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isCartActive
                                    ? "text-[var(--store-primary)]"
                                    : "text-[var(--store-text-primary)]"
                                    }`}
                            >
                                <ShoppingBag className="size-5" />

                                {cartCount > 0 && (
                                    <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                                        {cartCount > 9
                                            ? "9+"
                                            : cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <AvatarDropdown />
                            ) : (
                                <Link
                                    href="/store/login"
                                    aria-label="Login"
                                    className={`grid size-10 shrink-0 place-items-center rounded-full transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isAccountActive
                                        ? "text-[var(--store-primary)]"
                                        : "text-[var(--store-text-primary)]"
                                        }`}
                                >
                                    <UserRound className="size-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop category navigation */}
                <div
                    className={`hidden transform-gpu transition-[height,opacity,transform] duration-300 ease-out lg:block ${categoryNavbarVisible
                            ? "h-[56px] translate-y-0 overflow-visible opacity-100"
                            : "pointer-events-none h-0 -translate-y-full overflow-hidden opacity-0"
                        }`}
                    // aria-hidden={!categoryNavbarVisible}
                >
                    <nav className="relative h-[56px] border-b border-[var(--store-border)] bg-[var(--store-bg-1)]">
                        <div className="mx-auto flex h-full w-full items-center gap-7 px-4 lg:w-[1100px]">
                            {/* All categories dropdown */}
                            <div
                                ref={desktopCategoryRef}
                                className="relative h-full w-[285px] shrink-0"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDesktopSearchOpen(false);
                                        setDesktopCategoryMenuOpen(
                                            (previous) => !previous,
                                        );
                                    }}
                                    aria-haspopup="menu"
                                    aria-expanded={desktopCategoryMenuOpen}
                                    className={`flex h-full w-full items-center justify-between border-x border-black px-5 text-sm font-bold text-white transition ${desktopCategoryMenuOpen
                                            ? "bg-neutral-800"
                                            : "bg-black hover:bg-neutral-800"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Grid2X2 className="size-5" />
                                        All categories
                                    </span>

                                    <ChevronDown
                                        className={`size-4 transition-transform duration-200 ${desktopCategoryMenuOpen
                                                ? "rotate-180"
                                                : "rotate-0"
                                            }`}
                                    />
                                </button>

                                {desktopCategoryMenuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute left-0 top-full z-[90] w-full overflow-hidden border border-t-0 border-[var(--store-border)] bg-[var(--store-bg-1)] shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
                                    >
                                        <div className="max-h-[calc(100dvh-160px)] touch-pan-y overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={() => {
                                                    setDesktopCategoryMenuOpen(false);
                                                    router.push("/store/products");
                                                }}
                                                className="flex min-h-[62px] w-full items-center gap-3 border-b border-[var(--store-border)] px-5 text-left text-sm font-semibold text-[var(--store-primary)] transition hover:bg-[var(--store-bg-2)]"
                                            >
                                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary)]/10">
                                                    <ShoppingBag className="size-4" />
                                                </span>
                                                View all products
                                            </button>

                                            {flattenedCategoryItems.length > 0 ? (
                                                flattenedCategoryItems.map(
                                                    ({ item, depth }) => {
                                                        const categoryImage =
                                                            item.category.imageUrl?.trim();

                                                        return (
                                                            <button
                                                                key={item.category.id}
                                                                type="button"
                                                                role="menuitem"
                                                                onClick={() =>
                                                                    handleCategoryClick(
                                                                        item.category.id,
                                                                    )
                                                                }
                                                                className="flex min-h-[62px] w-full items-center gap-3 border-b border-[var(--store-border)] px-5 text-left text-sm font-medium text-[var(--store-text-primary)] transition last:border-b-0 hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                                                                style={{
                                                                    paddingLeft: `${20 +
                                                                        Math.min(depth, 3) *
                                                                        18
                                                                        }px`,
                                                                }}
                                                            >
                                                                {categoryImage ? (
                                                                    <span className="relative block size-10 shrink-0 overflow-hidden rounded-full border border-[var(--store-border)] bg-white">
                                                                        <Image
                                                                            src={imageUrlSet(
                                                                                categoryImage,
                                                                            )}
                                                                            alt={
                                                                                item.category.name
                                                                            }
                                                                            fill
                                                                            sizes="40px"
                                                                            className="object-cover"
                                                                        />
                                                                    </span>
                                                                ) : (
                                                                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-2)]">
                                                                        <Armchair className="size-4 text-[var(--store-text-secondary)]" />
                                                                    </span>
                                                                )}

                                                                <span className="min-w-0 flex-1 truncate">
                                                                    {item.category.name}
                                                                </span>
                                                            </button>
                                                        );
                                                    },
                                                )
                                            ) : (
                                                <p className="px-5 py-8 text-center text-sm text-[var(--store-text-secondary)]">
                                                    No categories found.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Main navigation links */}
                            <div className="flex h-full items-center gap-7">
                                <Link
                                    href="/store"
                                    className={`relative flex h-full items-center text-sm font-medium transition hover:text-[var(--store-primary)] ${isHomeActive
                                            ? "text-[var(--store-primary)]"
                                            : "text-[var(--store-text-primary)]"
                                        }`}
                                >
                                    Home

                                    {isHomeActive && (
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--store-primary)]" />
                                    )}
                                </Link>

                            </div>
                        </div>
                    </nav>
                </div>

                {/* Mobile top header */}
                <div
                    ref={desktopSearchRef}
                    className="relative border-b border-[var(--store-border)] lg:hidden bg-[var(--store-navbar-bg)] text-[var(--store-navbar-text)]"
                >
                    <div className="flex h-16 items-center justify-between px-4">
                        {/* Logo on the left */}
                        <div className="min-w-0">
                            <LogoComponent />
                        </div>

                        {/* Search and user on the right */}
                        <div className="flex items-center gap-1">
                            <StoreThemeToggle />

                            <button
                                type="button"
                                onClick={() => {
                                    setDesktopCategoryMenuOpen(false);
                                    setDesktopSearchOpen(
                                        (previous) => !previous,
                                    );
                                }}
                                aria-label="Search products"
                                aria-expanded={desktopSearchOpen}
                                className={`grid size-10 place-items-center rounded-full transition ${desktopSearchOpen
                                    ? "bg-[var(--store-bg-2)] text-[var(--store-primary)]"
                                    : "text-[var(--store-text-primary)] hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)]"
                                    }`}
                            >
                                {desktopSearchOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Search className="size-5" />
                                )}
                            </button>

                            {user ? (
                                <AvatarDropdown />
                            ) : (
                                <Link
                                    href="/store/login"
                                    aria-label="Login"
                                    className={`grid size-10 place-items-center rounded-full transition hover:bg-[var(--store-bg-2)] hover:text-[var(--store-primary)] ${isAccountActive
                                        ? "text-[var(--store-primary)]"
                                        : "text-[var(--store-text-primary)]"
                                        }`}
                                >
                                    <UserRound className="size-5" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Search appears after clicking the icon */}
                    {desktopSearchOpen && (
                        <div className="absolute inset-x-0 top-full z-[70] border-b border-[var(--store-border)] bg-[var(--store-bg-1)] p-4 shadow-lg">
                            <NavbarSearch
                                autoFocus
                                onSearch={handleSearch}
                                className="mx-auto max-w-md"
                            />
                        </div>
                    )}
                </div>

            </header>

            {/* Mobile overlay */}
            <button
                type="button"
                aria-label="Close mobile navigation"
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
                aria-label="Store navigation"
                aria-hidden={!mobileMenuOpen}
                className={`fixed left-0 top-0 z-[100] flex h-dvh w-[88%] max-w-sm flex-col bg-[var(--store-bg-1)] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen
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
                        <NavbarSearch
                            onSearch={handleSearch}
                        />
                    </div>

                    {/* Mobile primary links */}
                    <div className="border-b border-[var(--store-border)] px-5 py-5">
                        <nav className="space-y-4">
                            <Link
                                href="/store"
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className={`block text-sm font-medium ${isHomeActive
                                    ? "text-[var(--store-primary)]"
                                    : "text-[var(--store-text-primary)]"
                                    }`}
                            >
                                Home
                            </Link>

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
                    <a
                        href={`tel:${phoneHref}`}
                        className="block text-center text-xs text-gray-500"
                    >
                        Need help? {phoneNumber}
                    </a>
                </div>
            </aside>

            {/* Fixed mobile bottom navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-[var(--store-border)] bg-[var(--store-bg-1)] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:hidden">
                <div className="grid h-16 grid-cols-5">
                    <Link
                        href="/store"
                        aria-label="Home"
                        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${isHomeActive
                            ? "text-[var(--store-primary)]"
                            : "text-[var(--store-text-secondary)]"
                            }`}
                    >
                        <Home className="size-5" />
                        Home
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open categories"
                        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${mobileMenuOpen
                            ? "text-[var(--store-primary)]"
                            : "text-[var(--store-text-secondary)]"
                            }`}
                    >
                        <Grid2X2 className="size-5" />
                        Category
                    </button>

                    <Link
                        href="/store/dashboard/active-cart"
                        aria-label="Cart"
                        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${isCartActive
                            ? "text-[var(--store-primary)]"
                            : "text-[var(--store-text-secondary)]"
                            }`}
                    >
                        <span className="relative">
                            <ShoppingBag className="size-5" />

                            {cartCount > 0 && (
                                <span className="absolute -right-3 -top-2 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </span>

                        Cart
                    </Link>

                    <Link
                        href="/store/dashboard/wishlist"
                        aria-label="Wishlist"
                        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${isWishlistActive
                            ? "text-[var(--store-primary)]"
                            : "text-[var(--store-text-secondary)]"
                            }`}
                    >
                        <span className="relative">
                            <Heart className="size-5" />

                            {favoriteCount > 0 && (
                                <span className="absolute -right-3 -top-2 grid size-4 place-items-center rounded-full bg-[var(--store-primary)] text-[9px] font-bold text-white">
                                    {favoriteCount > 9
                                        ? "9+"
                                        : favoriteCount}
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
                        aria-label={user ? "Account" : "Login"}
                        className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${isAccountActive
                            ? "text-[var(--store-primary)]"
                            : "text-[var(--store-text-secondary)]"
                            }`}
                    >
                        <UserRound className="size-5" />
                        {user ? "Account" : "Login"}
                    </Link>
                </div>
            </nav>

        </>
    );
};

export default ToyNavbar;