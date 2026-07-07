"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import { useCustomerAddressList } from "@/lib/api/hooks/template-customer-address";
import { useTemplatePaymentMutation } from "@/lib/api/hooks/template-payment";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { CourierDeliveryPayload } from "@/types/courier/courier";
import { PaymentMethodStatus, PaymentPayload } from "@/types/template/template-payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, MapPin, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const paymentMethodOptions = [
    {
        label: "Online Payment",
        value: "ONLINE",
    },
    {
        label: "Cash on Delivery",
        value: "COD",
    }
] as const;

const paymentSchema = z
    .object({
        paymentMethod: z.enum(["COD", "ONLINE"], {
            error: "Payment method is required",
        }),
        shippingAddressId: z.string().optional(),
        shippingAddressSnapshot: z.object({
            address: z.string().optional(),
        }),
        note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const hasShippingAddressId = Boolean(data.shippingAddressId?.trim());
        const hasManualAddress = Boolean(
            data.shippingAddressSnapshot.address?.trim(),
        );

        if (!hasShippingAddressId && !hasManualAddress) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["shippingAddressSnapshot", "address"],
                message: "Select a shipping address or provide an address",
            });
        }
    });

export type PaymentFormValues = z.infer<typeof paymentSchema>;

type PaymentModalProps = {
    open: boolean;
    onClose: () => void;
    getCourierInfo: CourierDeliveryPayload;
    courierConfigId: string;
    handleOrderModal: (id: string, method: PaymentMethodStatus) => void;
};

export default function PaymentModal({
    open,
    onClose,
    getCourierInfo,
    courierConfigId,
    handleOrderModal,
}: PaymentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const {weight, ...withoutWeight} = getCourierInfo;

    const message = useMessage();
    const { createPayment } = useTemplatePaymentMutation();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            paymentMethod: "ONLINE",
            shippingAddressId: "",
            shippingAddressSnapshot: {
                address: "",
            },
            note: "",
        },
    });

    const { data: allAddresses, isLoading } = useCustomerAddressList();

    const addresses = allAddresses ?? [];

    const selectedAddressId = watch("shippingAddressId");
    const manualAddress = watch("shippingAddressSnapshot.address");

    const shippingAddressRegister = register("shippingAddressId");
    const manualAddressRegister = register("shippingAddressSnapshot.address");
    const noteRegister = register("note");

    const addressOptions = useMemo(() => {
        return addresses.map((address) => ({
            label: `${address.name} - ${address.city}`,
            value: address.id,
        }));
    }, [addresses]);

    const handleShippingAddressChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        shippingAddressRegister.onChange(event);

        const value = event.target.value;

        if (value) {
            setValue("shippingAddressSnapshot.address", "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const handleManualAddressChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        manualAddressRegister.onChange(event);

        const value = event.target.value;

        if (value.trim()) {
            setValue("shippingAddressId", "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        noteRegister.onChange(event);
    };

    const handlePayment = async (values: PaymentFormValues) => {
        try {
            setIsSubmitting(true);

            const paymentMethod = values.paymentMethod as PaymentMethodStatus;
            const note = values.note?.trim();

            let payload: PaymentPayload;

            if (values.shippingAddressId?.trim()) {
                payload = {
                    paymentMethod,
                    shippingAddressId: values.shippingAddressId.trim(),
                    courierConfigId,
                    courierQuote: withoutWeight,
                };

                if (note) {
                    payload.note = note;
                }
            } else {
                payload = {
                    paymentMethod,
                    courierConfigId,
                    courierQuote: withoutWeight,
                    shippingAddressSnapshot: {
                        address: values.shippingAddressSnapshot.address?.trim() || "",
                    },
                };

                if (note) {
                    payload.note = note;
                }
            }

              const res = await createPayment.mutateAsync(payload);

            message.success("Payment created successfully");

              handleOrderModal(res?.id, payload.paymentMethod);
            console.log('payload', payload);
            onClose();
        } catch (error) {
            message.error(getWebErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    const hasSelectedShippingAddress = Boolean(selectedAddressId);
    const hasManualAddress = Boolean(manualAddress?.trim());

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-4">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
                aria-label="Close modal"
            />

            <div className="relative z-10 flex max-h-[calc(100dvh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-[var(--store-border,#e5e7eb)] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                            <CreditCard className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[var(--store-text,#111827)]">
                                Payment
                            </h2>

                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Select payment method and shipping address.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-9 place-items-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-500 hover:text-white"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(handlePayment)}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 space-y-5 overflow-y-auto p-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Payment Method
                            </label>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {paymentMethodOptions.map((method) => (
                                    <label
                                        key={method.value}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--store-border,#e5e7eb)] p-4 transition hover:border-[var(--store-primary,#f16d59)]"
                                    >
                                        <input
                                            type="radio"
                                            value={method.value}
                                            {...register("paymentMethod")}
                                            className="size-4 accent-[var(--store-primary,#f16d59)]"
                                        />

                                        <span className="text-sm font-semibold text-[var(--store-text,#111827)]">
                                            {method.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {errors.paymentMethod && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.paymentMethod.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Shipping Address
                            </label>

                            <select
                                name={shippingAddressRegister.name}
                                ref={shippingAddressRegister.ref}
                                onBlur={shippingAddressRegister.onBlur}
                                onChange={handleShippingAddressChange}
                                disabled={isLoading || hasManualAddress}
                                className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">
                                    {isLoading
                                        ? "Loading addresses..."
                                        : "Select shipping address"}
                                </option>

                                {addressOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {hasManualAddress && (
                                <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                                    Clear manual address to select saved shipping address.
                                </p>
                            )}

                            {errors.shippingAddressId && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.shippingAddressId.message}
                                </p>
                            )}
                        </div>

                        {!hasSelectedShippingAddress && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                    Address
                                </label>

                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 size-5 text-[var(--store-muted,#6b7280)]" />

                                    <textarea
                                        name={manualAddressRegister.name}
                                        ref={manualAddressRegister.ref}
                                        onBlur={manualAddressRegister.onBlur}
                                        onChange={handleManualAddressChange}
                                        rows={3}
                                        placeholder="House 42, Dhaka"
                                        className="w-full resize-none rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent py-3 pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                                    />
                                </div>

                                {errors.shippingAddressSnapshot?.address && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.shippingAddressSnapshot.address.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Note
                            </label>

                            <textarea
                                name={noteRegister.name}
                                ref={noteRegister.ref}
                                onBlur={noteRegister.onBlur}
                                onChange={handleNoteChange}
                                rows={3}
                                placeholder="Please call before delivery"
                                className="w-full resize-none rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 py-3 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                            />
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] px-6 py-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--store-border,#e5e7eb)] px-6 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <CreditCard className="size-5" />
                            )}

                            {isSubmitting ? "Processing..." : "Confirm Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}