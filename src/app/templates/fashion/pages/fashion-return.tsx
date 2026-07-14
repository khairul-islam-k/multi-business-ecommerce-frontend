"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import { OrderReturnStatus } from "@/lib/api";
import {
  useTemplateOrderReturnMutation,
  useTemplateOrderReturnQuery,
} from "@/lib/api/hooks/template-return";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { CustomerOrderReturnItemResponse } from "@/types/template/return-history";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ReturnListResponse = {
  data?: CustomerOrderReturnItemResponse[];
  items?: CustomerOrderReturnItemResponse[];
  meta?: PaginationMeta;
  message?: string;
};

const formatCurrency = (value?: string | null) => {
  const amount = Number(value ?? 0);
  return `৳${amount.toLocaleString("en-BD")}`;
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatLabel = (value?: string | null) => {
  if (!value) return "N/A";

  return value.replaceAll("_", " ");
};

const getReturnStatusClass = (status: OrderReturnStatus) => {
  switch (status) {
    case "REQUESTED":
      return "bg-yellow-100 text-yellow-700";
    case "APPROVED":
      return "bg-blue-100 text-blue-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getReturnStatusIcon = (status: OrderReturnStatus) => {
  switch (status) {
    case "REQUESTED":
      return Clock3;
    case "APPROVED":
      return CheckCircle2;
    case "COMPLETED":
      return CheckCircle2;
    case "REJECTED":
      return XCircle;
    case "CANCELLED":
      return XCircle;
    default:
      return Clock3;
  }
};

const getReturnItemsQuantity = (data: CustomerOrderReturnItemResponse) => {
  return data.items.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);
};

const FashionReturn = () => {
  const message = useMessage();

  const {
    data: returnsResponse,
    isLoading,
    isFetching,
  } = useTemplateOrderReturnQuery();

  const { cancelOrder } = useTemplateOrderReturnMutation();

  const response = returnsResponse as ReturnListResponse | undefined;

  const returns: CustomerOrderReturnItemResponse[] = Array.isArray(
    returnsResponse,
  )
    ? returnsResponse
    : (response?.data ?? response?.items ?? []);

  const totalReturns = response?.meta?.total ?? returns.length;

  const isReturnLoading = isLoading || isFetching;

  const handleCancelReturn = (returnData: CustomerOrderReturnItemResponse) => {
    message.confirm({
      title: "Cancel return request?",
      content: (
        <div>
          <p>Are you sure you want to cancel this return request?</p>

          <p className="mt-1 font-semibold text-slate-900">
            Return No: {returnData.returnNo}
          </p>
        </div>
      ),
      okText: "Yes, Cancel",
      cancelText: "No",
      danger: true,
      onConfirm: async () => {
        try {
          await cancelOrder.mutateAsync(returnData.id);

          message.success("Return request cancelled successfully");
        } catch (error) {
          message.error(getWebErrorMessage(error));
        }
      },
    });
  };

  if (isReturnLoading) {
    return (
      <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-80 max-w-7xl items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="flex items-center gap-3 text-[var(--store-muted,#6b7280)]">
            <Loader2 className="size-6 animate-spin text-[var(--store-primary,#f16d59)]" />

            <span className="text-sm font-semibold">
              Loading return requests...
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--store-text,#111827)]">
              Return Requests
            </h1>

            <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
              View your return requests, return status, reason, and order
              details.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-[var(--store-card,#ffffff)] px-4 py-2 text-sm font-semibold text-[var(--store-text,#111827)] shadow-sm">
            <RotateCcw className="size-4 text-[var(--store-primary,#f16d59)]" />
            Total Returns: {totalReturns}
          </div>
        </div>

        {returns.length > 0 ? (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
              {returns.map((returnData) => {
                const StatusIcon = getReturnStatusIcon(returnData.status);
                const totalItems = getReturnItemsQuantity(returnData);
                const canCancel = returnData.status === "REQUESTED";

                return (
                  <div
                    key={returnData.id}
                    className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                          <ReceiptText className="size-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-[var(--store-text,#111827)]">
                            {returnData.returnNo}
                          </h3>

                          <p className="mt-1 text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                            Order: {returnData.order.orderNo}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--store-muted,#6b7280)]">
                            <CalendarDays className="size-3.5" />
                            {formatDate(returnData.createdAt)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getReturnStatusClass(
                          returnData.status,
                        )}`}
                      >
                        <StatusIcon className="size-3.5" />
                        {formatLabel(returnData.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Items
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          <PackageCheck className="size-4 text-[var(--store-primary,#f16d59)]" />
                          {totalItems} item{totalItems > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          {formatCurrency(returnData.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                      <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                        Reason
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm font-medium text-[var(--store-text,#111827)]">
                        {returnData.reason || "N/A"}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/store/dashboard/return/details/${returnData.id}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                      >
                        <Eye className="size-4" />
                        View
                      </Link>

                      <button
                        type="button"
                        disabled={!canCancel}
                        onClick={() => handleCancelReturn(returnData)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <XCircle className="size-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)] text-left">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Return
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Order
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Items
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Reason
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {returns.map((returnData) => {
                      const StatusIcon = getReturnStatusIcon(returnData.status);
                      const totalItems = getReturnItemsQuantity(returnData);
                      const canCancel = returnData.status === "REQUESTED";

                      return (
                        <tr
                          key={returnData.id}
                          className="border-b border-[var(--store-border,#e5e7eb)] transition hover:bg-[var(--store-secondary,#f8f5f1)]/70"
                        >
                          <td className="px-5 py-5 align-top">
                            <div className="flex items-start gap-3">
                              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                                <RotateCcw className="size-5" />
                              </div>

                              <div>
                                <p className="font-bold text-[var(--store-text,#111827)]">
                                  {returnData.returnNo}
                                </p>

                                <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                                  Return request
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                              {returnData.order.orderNo}
                            </p>

                            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                              {formatLabel(returnData.order.status)}
                            </p>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-2 text-sm text-[var(--store-text,#111827)]">
                              <CalendarDays className="size-4 text-[var(--store-muted,#6b7280)]" />
                              {formatDate(returnData.createdAt)}
                            </div>

                            {returnData.approvedAt && (
                              <p className="mt-1 text-xs text-green-600">
                                Approved: {formatDate(returnData.approvedAt)}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-2">
                              <PackageCheck className="size-4 text-[var(--store-primary,#f16d59)]" />

                              <span className="text-sm font-semibold text-[var(--store-text,#111827)]">
                                {totalItems} item{totalItems > 1 ? "s" : ""}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                              {returnData.items.length} return line
                              {returnData.items.length > 1 ? "s" : ""}
                            </p>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                              {formatCurrency(returnData.totalAmount)}
                            </p>

                            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                              Order:{" "}
                              {formatCurrency(returnData.order.totalAmount)}
                            </p>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getReturnStatusClass(
                                returnData.status,
                              )}`}
                            >
                              <StatusIcon className="size-3.5" />
                              {formatLabel(returnData.status)}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <p className="line-clamp-2 max-w-[240px] text-sm font-medium text-[var(--store-text,#111827)]">
                              {returnData.reason || "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-5 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/store/dashboard/return/details/${returnData.id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white text-black px-4 text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                              >
                                <Eye className="size-4" />
                                View
                              </Link>

                              <button
                                type="button"
                                disabled={!canCancel}
                                onClick={() => handleCancelReturn(returnData)}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                              >
                                <XCircle className="size-4" />
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] px-6 text-center shadow-sm">
            <div className="grid size-16 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
              <ShoppingBag className="size-8" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[var(--store-text,#111827)]">
              No return requests found
            </h2>

            <p className="mt-1 max-w-md text-sm text-[var(--store-muted,#6b7280)]">
              When you request a product return, it will appear here.
            </p>

            <Link
              href="/store/dashboard/order-history"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--store-primary,#f16d59)] px-6 text-sm font-semibold text-white transition hover:bg-gray-950"
            >
              View Orders
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FashionReturn;
