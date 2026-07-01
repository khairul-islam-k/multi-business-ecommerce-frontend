"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const visible = 3;
    const half = Math.floor(visible / 2);

    let start = Math.max(1, currentPage - half);
    let end = start + visible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPages();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    onPageChange(page);
  };

  const baseButtonClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  const normalButtonClass =
    "border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] text-[var(--store-text,#111827)] hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]";

  const activeButtonClass =
    "border-[var(--store-primary,#f16d59)] bg-[var(--store-primary,#f16d59)] text-white shadow-sm";

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => goToPage(1)}
        className={`${baseButtonClass} ${normalButtonClass}`}
      >
        First
      </button>

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className={`${baseButtonClass} ${normalButtonClass}`}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`${baseButtonClass} ${
              isActive ? activeButtonClass : normalButtonClass
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className={`${baseButtonClass} ${normalButtonClass}`}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(totalPages)}
        className={`${baseButtonClass} ${normalButtonClass}`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;