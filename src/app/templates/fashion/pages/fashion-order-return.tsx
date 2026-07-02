"use client";

import { useTemplateOrder } from "@/lib/api/hooks/template-order-history";
import { CustomerOrderItem, CustomerOrderResponse } from "@/types/template/order-history";
// import type {
//   CustomerOrderItem,
//   CustomerOrderResponse,
// } from "@/types/template/template-order-history";
import { ArrowLeft, CheckCircle2, Loader2, Package, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

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
  } | null;
  variant?: {
    id: string;
    title: string;
  } | null;
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

const getMaxQuantity = (quantity: string) => {
  const maxQuantity = Number(quantity || 1);

  if (Number.isNaN(maxQuantity) || maxQuantity < 1) {
    return 1;
  }

  return maxQuantity;
};

const FashionOrderReturn = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: details,
    isLoading,
    isFetching,
  } = useTemplateOrder(orderId);

  console.log('details', details);

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

  const updateItemState = (
    itemId: string,
    value: Partial<ReturnItemState>,
  ) => {
    setItemStates((previous) => ({
      ...previous,
      [itemId]: {
        ...previous[itemId],
        ...value,
      },
    }));
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
      setSubmitError("Please enable at least one item for return.");
      return;
    }

    const invalidReason = payload.items.some((item) => !item.reason.trim());

    if (invalidReason) {
      setSubmitError("Please provide reason for every selected item.");
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("return payload", payload);

      /*
        Call your API here:

        await createReturnRequest.mutateAsync({
          orderId,
          ...payload,
        });
      */

      alert("Return payload created. Check console.");
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong while submitting return request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-80 max-w-5xl items-center justify-center rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
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
    <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
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

          <div className="flex w-fit items-center gap-2 rounded-full bg-[var(--store-card,#ffffff)] px-4 py-2 text-sm font-semibold text-[var(--store-text,#111827)] shadow-sm">
            <RotateCcw className="size-4 text-[var(--store-primary,#f16d59)]" />
            Selected: {selectedItems.length}
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
          <label className="mb-2 block text-sm font-bold text-[var(--store-text,#111827)]">
            Main Return Reason
          </label>

          <textarea
            value={mainReason}
            onChange={(event) => setMainReason(event.target.value)}
            rows={3}
            placeholder="Example: Product arrived damaged"
            className="w-full resize-none rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/60 px-4 py-3 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)] focus:bg-white"
          />
        </div>

        <div className="space-y-4">
          {orderItems.map((item) => {
            const state = itemStates[item.id];
            const enabled = state?.enabled ?? false;
            const maxQuantity = getMaxQuantity(item.quantity);
            const productName = getProductName(item);
            const variantName = getVariantName(item);

            return (
              <div
                key={item.id}
                className={`rounded-3xl border bg-[var(--store-card,#ffffff)] p-5 shadow-sm transition ${
                  enabled
                    ? "border-[var(--store-primary,#f16d59)]"
                    : "border-[var(--store-border,#e5e7eb)]"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                      <Package className="size-6" />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                        {productName}
                      </h2>

                      {variantName && (
                        <p className="mt-1 text-xs font-semibold text-[var(--store-primary,#f16d59)]">
                          {variantName}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--store-muted,#6b7280)]">
                        <span>Ordered Qty: {maxQuantity}</span>
                        <span>•</span>
                        <span>Unit Price: ৳{item.unitPrice}</span>
                        <span>•</span>
                        <span>Line Total: ৳{item.lineTotal}</span>
                      </div>
                    </div>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <span className="text-sm font-semibold text-[var(--store-text,#111827)]">
                      Enable Return
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateItemState(item.id, {
                          enabled: !enabled,
                          reason: state?.reason || mainReason,
                        })
                      }
                      className={`relative h-7 w-13 rounded-full transition ${
                        enabled
                          ? "bg-[var(--store-primary,#f16d59)]"
                          : "bg-gray-300"
                      }`}
                      aria-label="Enable item return"
                    >
                      <span
                        className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${
                          enabled ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {enabled && (
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]">
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
                        className="h-12 w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/60 px-4 text-sm font-semibold text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)] focus:bg-white"
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
                        className="w-full resize-none rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-secondary,#f8f5f1)]/60 px-4 py-3 text-sm font-medium text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)] focus:bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {submitError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {submitError}
          </div>
        )}

        <div className="mt-6 rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[var(--store-text,#111827)]">
              Payload Preview
            </h3>

            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
              This is the data format you will send to API.
            </p>
          </div>

          <pre className="max-h-72 overflow-auto rounded-2xl bg-gray-950 p-4 text-xs leading-6 text-green-300">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/store/dashboard/order-history"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white px-6 text-sm font-bold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
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
    </section>
  );
};

export default FashionOrderReturn;