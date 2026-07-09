"use client";

import { useCartListQuery } from "@/lib/api/hooks/add-cart";
import {
  CalendarDays,
  Eye,
  Filter,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type ApiId = string;

type CartStatus = "ACTIVE" | "ORDERED";

type CartItem = {
  id: ApiId;
};

type CustomerCart = {
  id: ApiId;
  businessId: ApiId;
  customerId: ApiId;
  sessionId: string | null;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  items: CartItem[];
};

type CartListResponse =
  | CustomerCart[]
  | {
      data?: CustomerCart[];
      items?: CustomerCart[];
    };

const statusOptions = ["ALL", "ACTIVE", "ORDERED"] as const;

type StatusFilter = (typeof statusOptions)[number];

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatStatus = (status?: string) => {
  if (!status) return "N/A";

  return status.replaceAll("_", " ");
};

const getStatusClass = (status: CartStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "ORDERED":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getCartList = (response?: CartListResponse): CustomerCart[] => {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  return response.items ?? response.data ?? [];
};

const FashionAllCart = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { data: cartsResponse, isLoading, isFetching } = useCartListQuery();

  const carts = useMemo(() => {
    return getCartList(cartsResponse as CartListResponse);
  }, [cartsResponse]);

  const filteredCarts = useMemo(() => {
    if (statusFilter === "ALL") {
      return carts;
    }

    return carts.filter((cart) => cart.status === statusFilter);
  }, [carts, statusFilter]);

  const totalItems = useMemo(() => {
    return filteredCarts.reduce((total, cart) => {
      return total + (cart.items?.length ?? 0);
    }, 0);
  }, [filteredCarts]);

  const isPageLoading = isLoading || isFetching;

  return (
    <section className="w-full px-3 py-4 sm:px-4 lg:px-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold text-[var(--store-text,#111827)] sm:text-2xl">
                All Carts
              </h1>

              <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
                View customer carts with cart ID, created date, item count and
                status.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                    <ShoppingCart className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                      Total Carts
                    </p>

                    <p className="text-lg font-bold text-[var(--store-text,#111827)]">
                      {filteredCarts.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-blue-100 text-blue-600">
                    <Package className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                      Total Items
                    </p>

                    <p className="text-lg font-bold text-[var(--store-text,#111827)]">
                      {totalItems}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-green-100 text-green-600">
                    <Filter className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                      Filter
                    </p>

                    <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                      {formatStatus(statusFilter)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                Cart List
              </h2>

              <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                Filter carts by ACTIVE or ORDERED status.
              </p>
            </div>

            <div className="w-full sm:w-[240px]">
              <label className="mb-1 block text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="h-11 w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white px-4 text-sm font-semibold text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isPageLoading ? (
          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-[var(--store-muted,#6b7280)]">
              Loading carts...
            </p>
          </div>
        ) : null}

        {/* Mobile Cards */}
        {!isPageLoading && (
          <div className="space-y-4 md:hidden">
            {filteredCarts.map((cart) => (
              <div
                key={cart.id}
                className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                      Cart ID
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-[var(--store-text,#111827)]">
                      {cart.id}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      cart.status,
                    )}`}
                  >
                    {formatStatus(cart.status)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                    <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                      Items Count
                    </p>

                    <p className="mt-1 text-base font-bold text-[var(--store-text,#111827)]">
                      {cart.items?.length ?? 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                    <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                      Created At
                    </p>

                    <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                      {formatDate(cart.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/store/dashboard/all-cart/${cart.id}`}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                  >
                    <Eye className="size-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table */}
        {!isPageLoading && (
          <div className="hidden overflow-hidden md:p-6 rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="border-b border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)] text-left">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Cart ID
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Created At
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Items Count
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCarts.map((cart) => (
                    <tr
                      key={cart.id}
                      className="border-b border-[var(--store-border,#e5e7eb)] transition hover:bg-[var(--store-secondary,#f8f5f1)]/70"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                            <ShoppingCart className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[360px] truncate text-sm font-bold text-[var(--store-text,#111827)]">
                              {cart.id}
                            </p>

                            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                              Customer Cart
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--store-text,#111827)]">
                          <CalendarDays className="size-4 text-[var(--store-muted,#6b7280)]" />
                          {formatDate(cart.createdAt)}
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {cart.items?.length ?? 0} item
                          {(cart.items?.length ?? 0) > 1 ? "s" : ""}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            cart.status,
                          )}`}
                        >
                          {formatStatus(cart.status)}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-right">
                        <Link
                          href={`/store/dashboard/carts/details/${cart.id}`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white px-4 text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                        >
                          <Eye className="size-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCarts.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-[var(--store-muted,#6b7280)]">
                  No carts found for this status.
                </p>
              </div>
            )}
          </div>
        )}

        {!isPageLoading && filteredCarts.length === 0 && (
          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-8 text-center shadow-sm md:hidden">
            <p className="text-sm font-semibold text-[var(--store-muted,#6b7280)]">
              No carts found for this status.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FashionAllCart;