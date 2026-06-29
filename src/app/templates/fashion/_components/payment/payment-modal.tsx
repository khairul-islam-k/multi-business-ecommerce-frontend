"use client";

import { useCustomerAddressList } from "@/lib/api/hooks/template-customer-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, MapPin, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const paymentSchema = z.object({
    shippingAddressId: z.string().min(1, "Shipping address is required"),
    shippingAddressSnapshot: z.object({
        address: z.string().min(1, "Address is required"),
    }),
    note: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

type PaymentModalProps = {
    open: boolean;
    onClose: () => void;
    // addresses: CustomerAddress[];
    // isSubmitting?: boolean;
    // onSubmit: (values: PaymentFormValues) => void | Promise<void>;
};

export default function PaymentModal({
    open,
    onClose
}: PaymentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
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

    const addressOptions = useMemo(() => {
        return addresses.map((address) => ({
            label: `${address.name} - ${address.city}`,
            value: address.id,
        }));
    }, [addresses]);

    const selectedAddress = useMemo(() => {
        return addresses.find((address) => address.id === selectedAddressId);
    }, [addresses, selectedAddressId]);

    useEffect(() => {
        if (!selectedAddress) return;

        setValue(
            "shippingAddressSnapshot.address",
            `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.country}`,
            {
                shouldValidate: true,
            },
        );
    }, [selectedAddress, setValue]);

    const handlePayment = async (values: PaymentFormValues) => {
        console.log("payment payload", values);

        // await createOrder.mutateAsync(values);

        // setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
                aria-label="Close modal"
            />

            <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--store-border,#e5e7eb)] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                            <CreditCard className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[var(--store-text,#111827)]">
                                Payment
                            </h2>
                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Confirm your shipping address before payment.
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

                <form onSubmit={handleSubmit(handlePayment)} className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                            Shipping Address
                        </label>

                        <select
                            {...register("shippingAddressId")}
                            className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)]"
                        >
                            <option value="">Select shipping address</option>

                            {addressOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {errors.shippingAddressId && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.shippingAddressId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                            Address Snapshot
                        </label>

                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 size-5 text-[var(--store-muted,#6b7280)]" />

                            <textarea
                                {...register("shippingAddressSnapshot.address")}
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

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                            Note
                        </label>

                        <textarea
                            {...register("note")}
                            rows={3}
                            placeholder="Please call before delivery"
                            className="w-full resize-none rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 py-3 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[var(--store-border,#e5e7eb)] pt-5 sm:flex-row sm:justify-end">
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