"use client";

import { useTemplateReturnOrder } from "@/lib/api/hooks/template-return";
import { CustomerOrderReturnItemResponse, OrderReturnStatus } from "@/types/template/return-history";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  Loader2,
  MapPin,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

type ReturnDetailsResponse =
  | CustomerOrderReturnItemResponse
  | {
      data?: CustomerOrderReturnItemResponse;
    };

type ReturnStatusIconProps = {
  status: OrderReturnStatus;
  className?: string;
};

function ReturnStatusIcon({ status, className }: ReturnStatusIconProps) {
  switch (status) {
    case "REQUESTED":
      return <Clock3 className={className} />;

    case "APPROVED":
      return <CheckCircle2 className={className} />;

    case "COMPLETED":
      return <CheckCircle2 className={className} />;

    case "REJECTED":
      return <XCircle className={className} />;

    case "CANCELLED":
      return <XCircle className={className} />;

    default:
      return <Clock3 className={className} />;
  }
}

const getReturnDetails = (
  response?: ReturnDetailsResponse,
): CustomerOrderReturnItemResponse | undefined => {
  if (!response) return undefined;

  if ("data" in response && response.data) {
    return response.data;
  }

  return response as CustomerOrderReturnItemResponse;
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

const formatDateTime = (date?: string | null) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

const getPaymentStatusClass = (status?: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "UNPAID":
      return "bg-orange-100 text-orange-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "REFUNDED":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getOrderStatusClass = (status?: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "PROCESSING":
      return "bg-purple-100 text-purple-700";
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "RETURNED":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getTotalReturnedQuantity = (details: CustomerOrderReturnItemResponse) => {
  return details.items.reduce((sum, item) => {
    return sum + Number(item.quantity || 0);
  }, 0);
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--store-border,#e5e7eb)] py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
        {label}
      </span>

      <span className="text-sm font-bold text-[var(--store-text,#111827)] sm:text-right">
        {value}
      </span>
    </div>
  );
};

const ElectronicReturnDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: detailsResponse,
    isLoading,
    isFetching,
  } = useTemplateReturnOrder(id);

  const details = useMemo(() => {
    return getReturnDetails(detailsResponse as ReturnDetailsResponse);
  }, [detailsResponse]);

  const totalReturnedQuantity = details ? getTotalReturnedQuantity(details) : 0;

  if (isLoading || isFetching) {
    return (
      <section className="min-h-[60vh] px-3 py-4 sm:px-4 lg:px-6">
        <div className="flex min-h-80 items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="flex items-center gap-3 text-[var(--store-muted,#6b7280)]">
            <Loader2 className="size-6 animate-spin text-[var(--store-primary,#f16d59)]" />

            <span className="text-sm font-semibold">
              Loading return details...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!details) {
    return (
      <section className="min-h-[60vh] px-3 py-4 sm:px-4 lg:px-6">
        <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-xl font-bold text-[var(--store-text,#111827)]">
            Return request not found
          </h1>

          <Link
            href="/store/dashboard/return"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--store-primary,#f16d59)] px-6 text-sm font-semibold text-white transition hover:bg-gray-950"
          >
            Back to Returns
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-3 py-4 sm:px-4 lg:px-6">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <Link
                href="/store/dashboard/return"
                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--store-muted,#6b7280)] transition hover:text-[var(--store-primary,#f16d59)]"
              >
                <ArrowLeft className="size-4" />
                Back to return requests
              </Link>

              <h1 className="text-xl font-bold text-[var(--store-text,#111827)] sm:text-2xl">
                Return Details
              </h1>

              <p className="mt-1 break-words text-sm text-[var(--store-muted,#6b7280)]">
                Return No:{" "}
                <span className="font-semibold text-[var(--store-text,#111827)]">
                  {details.returnNo}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <span
                className={`inline-flex h-10 items-center justify-center gap-1 rounded-full px-4 text-xs font-bold ${getReturnStatusClass(
                  details.status,
                )}`}
              >
                <ReturnStatusIcon
                  status={details.status}
                  className="size-3.5"
                />
                {formatLabel(details.status)}
              </span>

              <Link
                href={`/store/dashboard/order-history/detail/${details.orderId}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--store-border,#e5e7eb)] bg-white px-4 text-xs font-bold text-black transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
              >
                <Eye className="size-4" />
                View Order
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                <RotateCcw className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Return Status
                </p>

                <p className="mt-1 truncate text-sm font-bold text-[var(--store-text,#111827)]">
                  {formatLabel(details.status)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
                <PackageCheck className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Returned Items
                </p>

                <p className="mt-1 truncate text-sm font-bold text-[var(--store-text,#111827)]">
                  {totalReturnedQuantity} item
                  {totalReturnedQuantity > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                <ReceiptText className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Return Amount
                </p>

                <p className="mt-1 truncate text-sm font-bold text-[var(--store-text,#111827)]">
                  {formatCurrency(details.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600">
                <CalendarDays className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Requested Date
                </p>

                <p className="mt-1 truncate text-sm font-bold text-[var(--store-text,#111827)]">
                  {formatDate(details.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left */}
          <div className="min-w-0 space-y-5">
            {/* Reason */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                  <ReceiptText className="size-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                    Return Reason
                  </h2>

                  <p className="mt-1 text-xs">
                    Customer provided reason for this return request.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                <p className="break-words text-sm font-medium leading-6 text-[var(--store-text,#111827)]">
                  {details.reason || "No reason provided."}
                </p>
              </div>
            </div>

            {/* Returned Items */}
            <div className="overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
              <div className="border-b border-[var(--store-border,#e5e7eb)] px-4 py-4 sm:px-5">
                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Returned Items
                </h2>

                <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                  Items included in this return request.
                </p>
              </div>

              {/* Desktop/Tablet Table */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--store-border)] bg-[var(--store-bg-1)] text-left">
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                          Item
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                          Quantity
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                          Unit Price
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                          Total
                        </th>

                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                          Reason
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {details.items.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-[var(--store-border,#e5e7eb)] transition hover:bg-[var(--store-secondary,#f8f5f1)]/70"
                        >
                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-3">
                              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                                <ShoppingBag className="size-5" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                                  Return Item #{index + 1}
                                </p>

                                <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                                  Product return line
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span className="text-sm font-bold text-[var(--store-text,#111827)]">
                              {item.quantity}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span className="text-sm font-bold text-[var(--store-text,#111827)]">
                              {formatCurrency(item.unitPrice)}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <span className="text-sm font-bold text-[var(--store-primary,#f16d59)]">
                              {formatCurrency(item.lineTotal)}
                            </span>
                          </td>

                          <td className="px-5 py-5 align-top">
                            <p className="line-clamp-2 max-w-[260px] text-sm font-medium text-[var(--store-text,#111827)]">
                              {item.reason || "N/A"}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 p-4 lg:hidden">
                {details.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[var(--store-bg-1)] p-4
                    border border-[var(--store-border)] "
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                        <ShoppingBag className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--store-text,#111827)]">
                          Return Item #{index + 1}
                        </p>

                        <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                          Product return line
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Qty
                        </p>

                        <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          {item.quantity}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Unit
                        </p>

                        <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          {formatCurrency(item.unitPrice)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-[var(--store-muted,#6b7280)]">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold text-[var(--store-primary,#f16d59)]">
                          {formatCurrency(item.lineTotal)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                        Reason
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-[var(--store-text,#111827)]">
                        {item.reason || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="min-w-0 space-y-5">
            {/* Order Info */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
                  <ReceiptText className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Order Info
                </h2>
              </div>

              <InfoRow label="Order No" value={details.order.orderNo} />

              <InfoRow
                label="Order Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusClass(
                      details.order.status,
                    )}`}
                  >
                    {formatLabel(details.order.status)}
                  </span>
                }
              />

              <InfoRow
                label="Order Date"
                value={formatDate(details.order.createdAt)}
              />

              <InfoRow
                label="Order Total"
                value={formatCurrency(details.order.totalAmount)}
              />
            </div>

            {/* Customer Info */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                  <User className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Customer Info
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                    Name
                  </p>

                  <p className="mt-1 break-words font-bold text-[var(--store-text,#111827)]">
                    {details.order.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-[var(--store-text,#111827)]">
                    {details.order.customerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                    Phone
                  </p>

                  <p className="mt-1 break-words font-medium text-[var(--store-text,#111827)]">
                    {details.order.customerPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
                  <MapPin className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text)]">
                  Shipping Address
                </h2>
              </div>

              <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                <p className="break-words text-sm font-medium leading-6 text-[var(--store-text,#111827)]">
                  {details.order.shippingAddressSnapshot?.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                  <CreditCard className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Payment Info
                </h2>
              </div>

              <InfoRow
                label="Payment Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                      details.order.paymentStatus,
                    )}`}
                  >
                    {formatLabel(details.order.paymentStatus)}
                  </span>
                }
              />

              <InfoRow
                label="Paid Amount"
                value={
                  <span className="text-green-600">
                    {formatCurrency(details.order.paidAmount)}
                  </span>
                }
              />

              <InfoRow
                label="Return Amount"
                value={
                  <span className="text-[var(--store-primary,#f16d59)]">
                    {formatCurrency(details.totalAmount)}
                  </span>
                }
              />
            </div>

            {/* Timeline */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                Return Timeline
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-yellow-100 text-yellow-700">
                    <Clock3 className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                      Return Requested
                    </p>

                    <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                      {formatDateTime(details.createdAt)}
                    </p>
                  </div>
                </div>

                {details.approvedAt && (
                  <div className="flex gap-3">
                    <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle2 className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                        Approved
                      </p>

                      <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                        {formatDateTime(details.approvedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {details.status === "CANCELLED" && (
                  <div className="flex gap-3">
                    <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-700">
                      <XCircle className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                        Return Cancelled
                      </p>

                      <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                        {formatDateTime(details.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/store/dashboard/order-history/detail/${details.orderId}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--store-primary,#f16d59)] px-6 text-sm font-bold text-white transition hover:bg-gray-950"
            >
              <Eye className="size-4" />
              View Original Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectronicReturnDetails;