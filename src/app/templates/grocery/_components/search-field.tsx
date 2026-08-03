"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const SearchField = () => {
  const router = useRouter();

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearch = (
    search: string,
  ) => {

    const query = search.trim();

    if (!query) return;

    setMobileSearchOpen(false);

    router.push(
      `/store/products?search=${encodeURIComponent(query)}`,
    );
  };

  return (
    <>
      {/* Desktop: search input with icon */}
      <form
        className="relative hidden w-[400px] mx-auto max-w-full lg:block"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          type="search"
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search for grocery products..."
          className="h-10 w-full rounded-full border border-[var(--store-border)] bg-[var(--store-bg-2)] pl-12 pr-5 text-sm text-[var(--store-text-primary)] outline-none transition placeholder:text-gray-400 focus:border-[var(--store-primary)]"
        />
      </form>

      {/* Mobile: only search icon */}
      <button
        type="button"
        onClick={() =>
          setMobileSearchOpen((previous) => !previous)
        }
        aria-label={
          mobileSearchOpen ? "Close search" : "Open search"
        }
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text-primary)] lg:hidden"
      >
        {mobileSearchOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </button>

      {/* Mobile: absolute search field outside navbar */}
      <div
        className={`absolute inset-x-0 top-full z-[100] border-t border-[var(--store-border)] bg-[var(--store-bg-1)] px-4 py-3 shadow-lg transition-all duration-300 lg:hidden ${mobileSearchOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
      >
        <form
          className="relative mx-auto w-full"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            ref={mobileInputRef}
            type="search"
            onChange={(event) =>
              handleSearch(event.target.value)
            }
            placeholder="Search products..."
            className="h-12 w-full rounded-full border border-[var(--store-border)] bg-[var(--store-bg-2)] pl-12 pr-14 text-sm text-[var(--store-text-primary)] outline-none placeholder:text-gray-400 focus:border-[var(--store-primary)]"
          />

          <button
            type="submit"
            aria-label="Search products"
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--store-primary)] text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchField;