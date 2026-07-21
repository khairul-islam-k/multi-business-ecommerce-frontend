"use client";

import { useTemplateOrder } from "@/lib/api/hooks/template-order-history";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  ReceiptText,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { CustomerOrderItem, CustomerOrderResponse } from "@/types/template/order-history";

type OrderDetailApiResponse =
  | CustomerOrderResponse
  | {
    data?: CustomerOrderResponse;
  };

type OrderItemImage = {
  id?: string;
  imageUrl: string;
  altText?: string | null;
  isThumbnail?: boolean;
};

type OrderItemProduct = {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  price?: string;
  status?: string;
};

type OrderItemVariant = {
  id?: string;
  title: string;
  priceOverride?: string | null;
  status?: string;
};

type OrderDetailItem = CustomerOrderItem & {
  product?: OrderItemProduct | null;
  variant?: OrderItemVariant | null;
  images?: OrderItemImage[];
};

type OrderDetail = Omit<CustomerOrderResponse, "items"> & {
  items: OrderDetailItem[];
};

const getOrderDetails = (
  response?: OrderDetailApiResponse,
): OrderDetail | undefined => {
  if (!response) return undefined;

  if ("data" in response && response.data) {
    return response.data as OrderDetail;
  }

  return response as OrderDetail;
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

const getOrderStatusClass = (status?: string) => {
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

const getPaymentStatusClass = (status?: string) => {
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

const getOrderItemImage = (item: OrderDetailItem) => {
  return (
    item.images?.find((image) => image.isThumbnail)?.imageUrl ||
    item.images?.[0]?.imageUrl
  );
};

const getOrderItemName = (item: OrderDetailItem) => {
  return item.product?.name || "Product";
};

const ElectronicOrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const {
    data: details,
    isLoading,
    isFetching,
  } = useTemplateOrder(orderId);

  const order = useMemo(() => {
    return getOrderDetails(details as OrderDetailApiResponse);
  }, [details]);

  const totalItems = useMemo(() => {
    return (
      order?.items?.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
      }, 0) ?? 0
    );
  }, [order]);

  const latestPayment = order?.payments?.[0];

  const dueAmount =
    Number(order?.totalAmount ?? 0) - Number(order?.paidAmount ?? 0);

  if (isLoading || isFetching) {
    return (
      <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-80 max-w-7xl items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="flex items-center gap-3 text-[var(--store-muted,#6b7280)]">
            <Loader2 className="size-6 animate-spin text-[var(--store-primary,#f16d59)]" />
            <span className="text-sm font-semibold">
              Loading order details...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[var(--store-card,#ffffff)] p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[var(--store-text,#111827)]">
            Order not found
          </h1>

          <Link
            href="/store/dashboard/order-history"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--store-primary,#f16d59)] px-6 text-sm font-semibold text-white transition hover:bg-gray-950"
          >
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--store-bg-1)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/store/dashboard/order-history"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--store-muted,#6b7280)] transition hover:text-[var(--store-primary,#f16d59)]"
            >
              <ArrowLeft className="size-4" />
              Back to order history
            </Link>

            <h1 className="text-2xl font-bold text-[var(--store-text,#111827)]">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
              Order No:{" "}
              <span className="font-semibold text-[var(--store-text,#111827)]">
                {order.orderNo}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${getOrderStatusClass(
                order.status,
              )}`}
            >
              {formatLabel(order.status)}
            </span>

            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${getPaymentStatusClass(
                order.paymentStatus,
              )}`}
            >
              {formatLabel(order.paymentStatus)}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                <CalendarDays className="size-5" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Order Date
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-blue-100 text-blue-600">
                <ShoppingBag className="size-5" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Total Items
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-green-100 text-green-600">
                <ReceiptText className="size-5" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Total Amount
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-orange-100 text-orange-600">
                <CreditCard className="size-5" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                  Due Amount
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--store-text,#111827)]">
                  {formatCurrency(String(Math.max(dueAmount, 0)))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left Side */}
          <div className="space-y-6">
            {/* Products */}
            <div className="overflow-hidden
            border
            rounded-3xl bg-[var(--store-card)] shadow-sm">
              <div className="border-b border-[var(--store-border,#e5e7eb)] px-5 py-4">
                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Ordered Products
                </h2>

                <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                  Products included in this order.
                </p>
              </div>

              <div className="divide-y divide-[var(--store-border,#e5e7eb)]">
                {order.items.map((item) => {
                  const image = getOrderItemImage(item);
                  const productName = getOrderItemName(item);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                    >
                      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#f8f5f1]">
                        {image ? (
                          <Image
                            src={imageUrlSet(image)}
                            alt={productName}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-gray-400">
                            <Package className="size-8" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-1 text-sm font-bold text-[var(--store-text,#111827)]">
                          {productName}
                        </h3>

                        {item.variant?.title && (
                          <p className="mt-1 text-xs font-semibold text-[var(--store-primary,#f16d59)]">
                            Variant: {item.variant.title}
                          </p>
                        )}

                        {item.product?.description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--store-muted,#6b7280)]">
                            {item.product.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>Unit: {formatCurrency(item.unitPrice)}</span>
                          <span>•</span>
                          <span>Total: {formatCurrency(item.lineTotal)}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                            {formatCurrency(item.lineTotal)}
                          </p>

                          <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                            {Number(item.quantity || 0)} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => router.push(`/store/dashboard/order-history/create-review/${item?.product?.id}`)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[var(--store-primary,#f16d59)] px-4 text-xs font-semibold text-[var(--store-primary,#f16d59)] transition hover:bg-[var(--store-primary,#f16d59)] hover:text-white"
                        >
                          <Star className="size-4" />
                          Write a Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
              <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                Order Timeline
              </h2>

              <div className="mt-5 space-y-4">
                {order.statusLogs?.length > 0 ? (
                  order.statusLogs.map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle2 className="size-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                          {formatLabel(log.toStatus)}
                        </p>

                        <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                          {formatDateTime(log.createdAt)}
                        </p>

                        {log.note && (
                          <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                            {log.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--store-muted,#6b7280)]">
                    No status history available.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
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
                  <p className="mt-1 font-bold text-[var(--store-text,#111827)]">
                    {order.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                    Email
                  </p>
                  <p className="mt-1 break-all font-medium text-[var(--store-text,#111827)]">
                    {order.customerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-[var(--store-text,#111827)]">
                    {order.customerPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-3xl bg-[var(--store-bg-1)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-blue-100 text-blue-600">
                  <MapPin className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Shipping Address
                </h2>
              </div>

              <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                <p className="text-sm font-medium leading-6 text-[var(--store-text,#111827)]">
                  {order.shippingAddressSnapshot?.address || "N/A"}
                </p>

                {order.shippingAddressSnapshot?.city && (
                  <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
                    {order.shippingAddressSnapshot.city}
                  </p>
                )}

                {order.shippingAddressSnapshot?.country && (
                  <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
                    {order.shippingAddressSnapshot.country}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-green-100 text-green-600">
                  <CreditCard className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Payment Summary
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Payment Method
                  </span>
                  <span className="font-bold text-[var(--store-text,#111827)]">
                    {formatLabel(latestPayment?.paymentMethod)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Payment Status
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getPaymentStatusClass(
                      order.paymentStatus,
                    )}`}
                  >
                    {formatLabel(order.paymentStatus)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Payment Amount
                  </span>
                  <span className="font-bold text-[var(--store-text,#111827)]">
                    {formatCurrency(latestPayment?.amount || order.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Paid Amount
                  </span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(order.paidAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Totals */}
            <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-orange-100 text-orange-600">
                  <ReceiptText className="size-5" />
                </div>

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Subtotal
                  </span>
                  <span className="font-semibold text-[var(--store-text,#111827)]">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Discount
                  </span>
                  <span className="font-semibold text-[var(--store-text,#111827)]">
                    {formatCurrency(order.discountTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--store-muted,#6b7280)]">
                    Tax
                  </span>
                  <span className="font-semibold text-[var(--store-text,#111827)]">
                    {formatCurrency(order.taxTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[var(--store-muted,#6b7280)]">
                    <Truck className="size-4" />
                    Shipping
                  </span>
                  <span className="font-semibold text-[var(--store-text,#111827)]">
                    {formatCurrency(order.shippingCharge)}
                  </span>
                </div>

                <div className="border-t border-[var(--store-border,#e5e7eb)] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[var(--store-text,#111827)]">
                      Total
                    </span>
                    <span className="text-lg font-bold text-[var(--store-primary,#f16d59)]">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            {order.note && (
              <div className="rounded-3xl bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Order Note
                </h2>

                <p className="mt-3 rounded-2xl bg-[var(--store-bg-1)] p-4 text-sm leading-6 text-[var(--store-muted,#6b7280)]">
                  {order.note}
                </p>
              </div>
            )}

            {/* Return Button */}
            <Link
              href={`/store/dashboard/order-history/return/${order.id}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--store-primary,#f16d59)] px-6 text-sm font-bold text-white transition hover:bg-gray-950"
            >
              <RotateCcw className="size-4" />
              Request Return
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectronicOrderDetail;