"use client";

import {
  useTemplateOrder,
  useTemplateOrderMutation,
} from "@/lib/api/hooks/template-order-history";
import {
  CustomerOrderItem,
  CustomerOrderResponse,
} from "@/types/template/order-history";
import { imageUrlSet } from "@/app/(dashboard)/admin/dashboard/product-catalog/products/_components/image-url";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Loader2,
  Package,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useMessage } from "@/app/store/_components/message/message-hook";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";

export type ReturnRequestItemPayload = {
  orderItemId: string;
  quantity: number;
  reason: string;
};

export type ReturnRequestPayload = {
  reason: string;
  items: ReturnRequestItemPayload[];
};

type OrderDetailsResponse =
  | CustomerOrderResponse
  | {
      data?: CustomerOrderResponse;
    };

type ReturnableOrderItem = CustomerOrderItem & {
  product?: {
    id: string;
    name: string;
    slug?: string;
    description?: string | null;
  } | null;
  variant?: {
    id: string;
    title: string;
  } | null;
  images?: {
    id?: string;
    imageUrl: string;
    altText?: string | null;
    isThumbnail?: boolean;
  }[];
};

type ReturnItemState = {
  enabled: boolean;
  quantity: number;
  reason: string;
};

const getOrderDetails = (
  response?: OrderDetailsResponse,
): CustomerOrderResponse | undefined => {
  if (!response) return undefined;

  if ("data" in response && response.data) {
    return response.data;
  }

  return response as CustomerOrderResponse;
};

const getProductName = (item: ReturnableOrderItem) => {
  if (item.product?.name) return item.product.name;

  return `Product ID: ${item.productId}`;
};

const getVariantName = (item: ReturnableOrderItem) => {
  if (item.variant?.title) return item.variant.title;

  if (item.variantId) return `Variant ID: ${item.variantId}`;

  return null;
};

const getItemImage = (item: ReturnableOrderItem) => {
  return (
    item.images?.find((image) => image.isThumbnail)?.imageUrl ||
    item.images?.[0]?.imageUrl
  );
};

const getMaxQuantity = (quantity: string) => {
  const maxQuantity = Number(quantity || 1);

  if (Number.isNaN(maxQuantity) || maxQuantity < 1) {
    return 1;
  }

  return maxQuantity;
};

const formatCurrency = (value?: string | null) => {
  const amount = Number(value ?? 0);

  return `৳${amount.toLocaleString("en-BD")}`;
};

const FashionOrderReturn = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { orderReturn } = useTemplateOrderMutation();

  const message = useMessage();

  const { data: details, isLoading, isFetching } = useTemplateOrder(orderId);

  const order = useMemo(() => {
    return getOrderDetails(details as OrderDetailsResponse);
  }, [details]);

  const orderItems = useMemo(() => {
    return (order?.items ?? []) as ReturnableOrderItem[];
  }, [order]);

  const [mainReason, setMainReason] = useState("Product arrived damaged");

  const [itemStates, setItemStates] = useState<Record<string, ReturnItemState>>(
    {},
  );

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!orderItems.length) return;

    const nextState: Record<string, ReturnItemState> = {};

    orderItems.forEach((item) => {
      nextState[item.id] = {
        enabled: false,
        quantity: 1,
        reason: "",
      };
    });

    setItemStates(nextState);
  }, [orderItems]);

  const selectedItems = useMemo(() => {
    return orderItems.filter((item) => itemStates[item.id]?.enabled);
  }, [orderItems, itemStates]);

  const payload: ReturnRequestPayload = useMemo(() => {
    return {
      reason: mainReason,
      items: selectedItems.map((item) => ({
        orderItemId: item.id,
        quantity: itemStates[item.id]?.quantity ?? 1,
        reason: itemStates[item.id]?.reason || mainReason,
      })),
    };
  }, [mainReason, selectedItems, itemStates]);

  const updateItemState = (itemId: string, value: Partial<ReturnItemState>) => {
    setItemStates((previous) => ({
      ...previous,
      [itemId]: {
        ...previous[itemId],
        ...value,
      },
    }));
  };

  const handleToggleReturn = (item: ReturnableOrderItem) => {
    const state = itemStates[item.id];
    const enabled = state?.enabled ?? false;

    updateItemState(item.id, {
      enabled: !enabled,
      reason: state?.reason || mainReason,
    });
  };

  const handleQuantityChange = (item: ReturnableOrderItem, value: string) => {
    const maxQuantity = getMaxQuantity(item.quantity);
    const quantityValue = Number(value);

    if (Number.isNaN(quantityValue)) {
      updateItemState(item.id, {
        quantity: 1,
      });
      return;
    }

    const safeQuantity = Math.min(Math.max(quantityValue, 1), maxQuantity);

    updateItemState(item.id, {
      quantity: safeQuantity,
    });
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!mainReason.trim()) {
      setSubmitError("Return reason is required.");
      return;
    }

    if (!payload.items.length) {
      setSubmitError("Please select at least one item for return.");
      return;
    }

    const invalidReason = payload.items.some((item) => !item.reason.trim());

    if (invalidReason) {
      setSubmitError("Please provide reason for every selected item.");
      return;
    }

    try {
      setIsSubmitting(true);

      await orderReturn.mutateAsync({
        orderId,
        payload,
      });
      message.success("Return has been successfully");
    } catch (error) {
      message.error(getWebErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <section className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-80 max-w-5xl items-center justify-center rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 text-[var(--store-muted,#6b7280)]">
            <Loader2 className="size-6 animate-spin text-[var(--store-primary,#f16d59)]" />

            <span className="text-sm font-semibold">
              Loading order items...
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
    <section className="min-h-screen bg-[var(--store-bg-3)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/store/dashboard/order-history"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--store-muted,#6b7280)] transition hover:text-[var(--store-primary,#f16d59)]"
            >
              <ArrowLeft className="size-4" />
              Back to order history
            </Link>

            <h1 className="text-2xl font-bold text-[var(--store-text,#111827)]">
              Return Request
            </h1>

            <p className="mt-1 text-sm text-[var(--store-muted,#6b7280)]">
              Order No:{" "}
              <span className="font-semibold text-[var(--store-text,#111827)]">
                {order.orderNo}
              </span>
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-[var(--store-card)] px-4 py-2 text-sm font-semibold text-[var(--store-text,#111827)] shadow-sm">
            <RotateCcw className="size-4 text-[var(--store-primary,#f16d59)]" />
            Selected: {selectedItems.length}
          </div>
        </div>

        {/* Main Reason */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-[var(--store-border)] bg-[var(--store-bg-1)] shadow-sm">
          <div className="border-b border-[var(--store-border)] bg-[var(--store-primary,#f16d59)]/5 px-5 py-4">
            <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
              Return Reason
            </h2>

            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
              This reason will be used as default for selected items.
            </p>
          </div>

          <div className="p-5">
            <textarea
              value={mainReason}
              onChange={(event) => setMainReason(event.target.value)}
              rows={3}
              placeholder="Example: Product arrived damaged"
              className="w-full resize-none rounded-2xl border border-[var(--store-border)] bg-[var(--store-bg-1)] px-4 py-3 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)] focus:shadow-sm"
            />
          </div>
        </div>

        {/* Items */}
        <div className="space-y-5">
          {orderItems.map((item) => {
            const state = itemStates[item.id];
            const enabled = state?.enabled ?? false;
            const maxQuantity = getMaxQuantity(item.quantity);
            const productName = getProductName(item);
            const variantName = getVariantName(item);
            const itemImage = getItemImage(item);

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-3xl border bg-[var(--store-bg-1)] shadow-sm transition-all duration-300 ${
                  enabled
                    ? "border-[var(--store-primary,#f16d59)] ring-4 ring-[var(--store-primary,#f16d59)]/10"
                    : "border-[var(--store-border)] hover:border-[var(--store-primary,#f16d59)]/40"
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl bg-[#f8f5f1]">
                        {itemImage ? (
                          <Image
                            src={imageUrlSet(itemImage)}
                            alt={productName}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[var(--store-primary,#f16d59)]">
                            <Package className="size-9" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="line-clamp-1 text-base font-bold">
                          {productName}
                        </h2>

                        {variantName && (
                          <p className="mt-1 text-xs font-semibold text-[var(--store-primary)]">
                            {variantName}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[var(--store-bg-3)] px-3 py-1 text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                            Ordered Qty: {maxQuantity}
                          </span>

                          <span className="rounded-full bg-[var(--store-bg-3)] px-3 py-1 text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                            Unit: {formatCurrency(item.unitPrice)}
                          </span>

                          <span className="rounded-full bg-[var(--store-bg-3)] px-3 py-1 text-xs font-semibold text-[var(--store-muted,#6b7280)]">
                            Total: {formatCurrency(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Beautiful Enable Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleReturn(item)}
                      className={`group/toggle inline-flex h-12 w-full items-center justify-between gap-3 rounded-2xl border px-4 text-sm font-bold transition-all duration-300 sm:w-[210px] ${
                        enabled
                          ? "border-[var(--store-primary,#f16d59)] bg-[var(--store-primary,#f16d59)] text-white shadow-lg shadow-[var(--store-primary,#f16d59)]/20"
                          : "border-[var(--store-border)] bg-[var(--store-bg-1)] text-[var(--store-text,#111827)] hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`grid size-6 place-items-center rounded-full transition ${
                            enabled
                              ? "bg-white text-[var(--store-primary,#f16d59)]"
                              : "bg-gray-100 text-gray-400 group-hover/toggle:bg-[var(--store-primary,#f16d59)] group-hover/toggle:text-white"
                          }`}
                        >
                          {enabled ? (
                            <Check className="size-4" />
                          ) : (
                            <RotateCcw className="size-3.5" />
                          )}
                        </span>

                        {enabled ? "Selected" : "Select Return"}
                      </span>

                      <span
                        className={`relative h-7 w-[58px] rounded-full transition ${
                          enabled ? "bg-white/30" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 size-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                            enabled
                              ? "left-8"
                              : "left-1 group-hover/toggle:bg-[var(--store-primary,#f16d59)]"
                          }`}
                        />
                      </span>
                    </button>
                  </div>

                  {enabled && (
                    <div className="mt-5 rounded-3xl border border-[var(--store-border)]/20 bg-[var(--store-primary,#f16d59)]/5 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-[var(--store-text,#111827)]">
                            Return information
                          </h3>

                          <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                            Change quantity and give item-specific reason.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateItemState(item.id, {
                              enabled: false,
                            })
                          }
                          className="grid size-9 place-items-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
                          aria-label="Remove item from return"
                        >
                          <X className="size-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-[var(--store-text,#111827)]">
                            Return Quantity
                          </label>

                          <input
                            type="number"
                            min={1}
                            max={maxQuantity}
                            value={state?.quantity ?? 1}
                            onChange={(event) =>
                              handleQuantityChange(item, event.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] px-4 text-sm font-semibold text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)] focus:shadow-sm"
                          />

                          <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                            Max quantity: {maxQuantity}
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-[var(--store-text,#111827)]">
                            Item Reason
                          </label>

                          <textarea
                            rows={3}
                            value={state?.reason ?? ""}
                            onChange={(event) =>
                              updateItemState(item.id, {
                                reason: event.target.value,
                              })
                            }
                            placeholder="Example: Damaged item"
                            className="w-full resize-none rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] px-4 py-3 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)] focus:shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {submitError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {submitError}
          </div>
        )}

        {/* Footer Actions */}
        <div className="sticky bottom-4 mt-8 rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)]/95 p-4 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--store-text,#111827)]">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
                selected for return
              </p>

              <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                Submit your return request after selecting products.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Link
                href="/store/dashboard/order-history"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] px-6 text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
              >
                Cancel
              </Link>

              <button
                type="button"
                disabled={isSubmitting || !payload.items.length}
                onClick={handleSubmit}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--store-primary,#f16d59)] px-6 text-sm font-bold text-white transition hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FashionOrderReturn;