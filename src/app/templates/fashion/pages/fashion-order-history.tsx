"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import { OrderStatus } from "@/lib/api";
import { useTemplateOrderHistoryQuery, useTemplateOrderMutation } from "@/lib/api/hooks/template-order-history";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { CustomerOrderResponse } from "@/types/template/order-history";
import { PaymentStatus } from "@/types/template/template-payment";
import {
  CalendarDays,
  CreditCard,
  Eye,
  Loader2,
  MoreVertical,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import PaymentGatewayModal from "../_components/payment/payment-gateway-modal";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type OrderHistoryResponse = {
  data?: CustomerOrderResponse[];
  items?: CustomerOrderResponse[];
  meta?: PaginationMeta;
  message?: string;
};

const orderStatusOptions: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const paymentStatusOptions: PaymentStatus[] = [
  "PENDING",
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

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

const formatLabel = (value: string) => {
  return value.replaceAll("_", " ");
};

const getPaymentStatusClass = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "UNPAID":
      return "bg-orange-100 text-orange-700";
    case "PARTIALLY_PAID":
      return "bg-blue-100 text-blue-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "REFUNDED":
      return "bg-purple-100 text-purple-700";
    case "PARTIALLY_REFUNDED":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getOrderStatusClass = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "PROCESSING":
      return "bg-purple-100 text-purple-700";
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "RETURNED":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
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

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
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

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`${baseButtonClass} ${isActive ? activeButtonClass : normalButtonClass
              }`}
          >
            {page}
          </button>
        );
      })}

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
}

type OrderActionDropdownProps = {
  order: CustomerOrderResponse;
  openActionId: string | null;
  setOpenActionId: React.Dispatch<React.SetStateAction<string | null>>;
};

function OrderActionDropdown({
  order,
  openActionId,
  setOpenActionId,
}: OrderActionDropdownProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const message = useMessage();

  // cancel modal
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  // payment modal 

  // payment
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  const { cancelOrder } = useTemplateOrderMutation();

  const isOpen = openActionId === order.id;

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = buttonRef.current?.getBoundingClientRect();

    if (rect) {
      const menuWidth = 176;
      const gap = 8;

      setMenuPosition({
        top: rect.bottom + gap,
        left: Math.min(
          Math.max(12, rect.right - menuWidth),
          window.innerWidth - menuWidth - 12,
        ),
      });
    }

    setOpenActionId(isOpen ? null : order.id);
  };

  const closeMenu = () => {
    setOpenActionId(null);
  };

  const handleGoToDetail = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    closeMenu();

    router.push(`/store/dashboard/order-history/detail/${order.id}`);
  };


  // cancel

  const handleCancelOrder = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    closeMenu();

    setCancelModalOpen(true);
  };

  const handleSubmitCancelOrder = async () => {

    try {
      setIsCancelling(true);

      await cancelOrder.mutateAsync({
        orderId: order.id,
        payload: {
          reason: cancelReason
        },
      });

      message.success("Order cancelled successfully");

      setCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      message.error(getWebErrorMessage(error));
    } finally {
      setIsCancelling(false);
    }
  };

  // start payment
  const handleGoToPayment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setOpenPayment(true);
    setOrderId(order.id);
    closeMenu?.();

  };


  const handleReturnOrder = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    closeMenu();
    router.push(`/store/dashboard/order-history/return/${order.id}`)
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openMenu}
        className="grid size-9 place-items-center rounded-full border border-[var(--store-border,#e5e7eb)] bg-white text-[var(--store-muted,#6b7280)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
        aria-label="Order actions"
      >
        <MoreVertical className="size-5" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close order actions"
            onClick={closeMenu}
            className="fixed inset-0 z-[9998] cursor-default bg-transparent"
          />

          <div
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="fixed z-[9999] w-44 overflow-hidden rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white shadow-xl"
          >
            <button
              type="button"
              onClick={handleGoToDetail}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[var(--store-text,#111827)] transition hover:bg-[var(--store-secondary,#f8f5f1)]"
            >
              <Eye className="size-4" />
              Detail
            </button>

            {
              (!order.isCod && !(order.paymentStatus === 'PAID'))  &&
              <button
                type="button"
                onClick={handleGoToPayment}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-[var(--store-text,#111827)] transition hover:bg-[var(--store-secondary,#f8f5f1)]"
              >
                <CreditCard className="size-4" />
                Pay
              </button>

            }

            <button
              type="button"
              onClick={handleCancelOrder}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <XCircle className="size-4" />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReturnOrder}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              <RotateCcw className="size-4" />
              Return
            </button>
          </div>
        </>
      )}

      {/* modal cancel */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cancel Order
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Please write why you want to cancel this order.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCancelModalOpen(false);
                  setCancelReason("");
                }}
                className="grid size-9 place-items-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-500 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="mb-4 rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold text-gray-500">Order No</p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {order.orderNo}
                </p>
              </div>

              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Cancel Reason <span className="text-red-500">*</span>
              </label>

              <textarea
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                rows={5}
                placeholder="Example: I placed the wrong order."
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#f16d59] focus:bg-white"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => {
                  setCancelModalOpen(false);
                  setCancelReason("");
                }}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isCancelling}
                onClick={handleSubmitCancelOrder}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling && <Loader2 className="size-4 animate-spin" />}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentGatewayModal
        open={openPayment}
        orderId={orderId}
        onClose={() => setOpenPayment(false)}
      />
    </>
  );
}

export default function FashionOrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentStatus | undefined
  >();

  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
  } = useTemplateOrderHistoryQuery({
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter,
    paymentStatus: paymentStatusFilter,
    sortOrder: "desc",
  });

  const response = ordersResponse as OrderHistoryResponse | undefined;

  const orders: CustomerOrderResponse[] = Array.isArray(ordersResponse)
    ? ordersResponse
    : response?.data ?? response?.items ?? [];

  const meta = response?.meta;

  const totalPages = meta?.totalPages ?? 1;
  const totalOrders = meta?.total ?? orders.length;

  const isOrderLoading = isLoading || isFetching;

  const hasActiveFilter = Boolean(
    search || statusFilter || paymentStatusFilter,
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter(undefined);
    setPaymentStatusFilter(undefined);
    setCurrentPage(1);
  };

  return (
    <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--store-text,#111827)]">
              Order History
            </h1>

            <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
              View your previous orders, payment status, and order details.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-[var(--store-card,#ffffff)] px-4 py-2 text-sm font-semibold text-[var(--store-text,#111827)] shadow-sm">
            <ShoppingBag className="size-4 text-[var(--store-primary,#f16d59)]" />
            Total Orders: {totalOrders}
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="border-b border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                <SlidersHorizontal className="size-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Filter Orders
                </h2>

                <p className="text-xs text-[var(--store-muted,#6b7280)]">
                  Search and filter your order history
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                  Search Order
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)] transition group-focus-within:bg-[var(--store-primary,#f16d59)] group-focus-within:text-white">
                    <Search className="size-4" />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by order number..."
                    className="h-[52px] w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/60 pl-16 pr-11 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)] focus:bg-white focus:shadow-sm"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-4 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-gray-200 text-gray-600 transition hover:bg-red-500 hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                  Order Status
                </label>

                <select
                  value={statusFilter ?? ""}
                  onChange={(event) => {
                    const value = event.target.value as OrderStatus | "";
                    setStatusFilter(value || undefined);
                    setCurrentPage(1);
                  }}
                  className="h-[52px] w-full cursor-pointer rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/60 px-4 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)] focus:bg-white focus:shadow-sm"
                >
                  <option value="">All Order Status</option>

                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                  Payment Status
                </label>

                <select
                  value={paymentStatusFilter ?? ""}
                  onChange={(event) => {
                    const value = event.target.value as PaymentStatus | "";
                    setPaymentStatusFilter(value || undefined);
                    setCurrentPage(1);
                  }}
                  className="h-[52px] w-full cursor-pointer rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/60 px-4 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)] focus:bg-white focus:shadow-sm"
                >
                  <option value="">All Payment Status</option>

                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="button"
                  disabled={!hasActiveFilter}
                  onClick={clearFilters}
                  className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white px-5 text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-red-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--store-border,#e5e7eb)] disabled:hover:bg-white disabled:hover:text-[var(--store-text,#111827)] lg:w-auto"
                >
                  <X className="size-4" />
                  Clear
                </button>
              </div>
            </div>

            {hasActiveFilter && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Active filters:
                </span>

                {search && (
                  <span className="rounded-full bg-[var(--store-primary,#f16d59)]/10 px-3 py-1 text-xs font-bold text-[var(--store-primary,#f16d59)]">
                    Search: {search}
                  </span>
                )}

                {statusFilter && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    Order: {formatLabel(statusFilter)}
                  </span>
                )}

                {paymentStatusFilter && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Payment: {formatLabel(paymentStatusFilter)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {isOrderLoading ? (
          <div className="flex min-h-80 items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
            <div className="flex items-center gap-3 text-[var(--store-muted,#6b7280)]">
              <Loader2 className="size-6 animate-spin text-[var(--store-primary,#f16d59)]" />

              <span className="text-sm font-semibold">
                Loading order history...
              </span>
            </div>
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="space-y-4 md:hidden">
              {orders.map((order) => {
                const payment = order.payments?.[0];

                const totalItems = order.items.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0,
                );

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                          <ReceiptText className="size-5" />
                        </div>

                        <div>
                          <h3 className="font-bold text-[var(--store-text,#111827)]">
                            {order.orderNo}
                          </h3>

                          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--store-muted,#6b7280)]">
                            <CalendarDays className="size-3.5" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <OrderActionDropdown
                        order={order}
                        openActionId={openActionId}
                        setOpenActionId={setOpenActionId}
                      />
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
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Payment
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          <CreditCard className="size-4 text-[var(--store-muted,#6b7280)]" />
                          {payment?.paymentMethod || "N/A"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Paid
                        </p>

                        <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          {formatCurrency(order.paidAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClass(
                          order.status,
                        )}`}
                      >
                        {formatLabel(order.status)}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {formatLabel(order.paymentStatus)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:p-6 rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)] text-left">
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
                        Payment
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Order Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Payment Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => {
                      const payment = order.payments?.[0];

                      const totalItems = order.items.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      );

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-[var(--store-border,#e5e7eb)] transition hover:bg-[var(--store-secondary,#f8f5f1)]/70"
                        >
                          <td className="px-5 py-5 align-top">
                            <div className="flex items-start gap-3">
                              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                                <ReceiptText className="size-5" />
                              </div>

                              <div>
                                <p className="font-bold text-[var(--store-text,#111827)]">
                                  {order.orderNo}
                                </p>

                                <p className="mt-1 max-w-[180px] truncate text-xs text-[var(--store-muted,#6b7280)]">
                                  {order.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-2 text-sm text-[var(--store-text,#111827)]">
                              <CalendarDays className="size-4 text-[var(--store-muted,#6b7280)]" />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-2">
                              <PackageCheck className="size-4 text-[var(--store-primary,#f16d59)]" />

                              <span className="text-sm font-semibold text-[var(--store-text,#111827)]">
                                {totalItems} item{totalItems > 1 ? "s" : ""}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-2">
                              <CreditCard className="size-4 text-[var(--store-muted,#6b7280)]" />

                              <span className="text-sm font-semibold text-[var(--store-text,#111827)]">
                                {payment?.paymentMethod || "N/A"}
                              </span>
                            </div>

                            <p className="mt-1 max-w-[170px] truncate text-xs text-[var(--store-muted,#6b7280)]">
                              {payment?.transactionReference ||
                                "No transaction"}
                            </p>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                              {formatCurrency(order.totalAmount)}
                            </p>

                            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                              Paid: {formatCurrency(order.paidAmount)}
                            </p>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClass(
                                order.status,
                              )}`}
                            >
                              {formatLabel(order.status)}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                                order.paymentStatus,
                              )}`}
                            >
                              {formatLabel(order.paymentStatus)}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top text-right">
                            <OrderActionDropdown
                              order={order}
                              openActionId={openActionId}
                              setOpenActionId={setOpenActionId}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] px-6 text-center shadow-sm">
            <div className="grid size-16 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
              <ShoppingBag className="size-8" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[var(--store-text,#111827)]">
              No orders found
            </h2>

            <p className="mt-1 max-w-md text-sm text-[var(--store-muted,#6b7280)]">
              You have not placed any order yet. After checkout, your orders
              will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}