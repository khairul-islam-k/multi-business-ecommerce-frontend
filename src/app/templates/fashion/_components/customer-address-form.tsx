"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Loader2, MapPin, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const customerAddressSchema = z.object({
    addressType: z.enum(["HOME", "OFFICE", "SHIPPING", "BILLING", "OTHER"], {
        error: "Address type is required",
    }),
    name: z.string().min(1, "Address name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    isDefault: z.boolean(),
});

export type CustomerAddressFormValues = z.infer<typeof customerAddressSchema>;

type CustomerAddressFormProps = {
    mode: "create" | "update";
    defaultValues?: Partial<CustomerAddressFormValues>;
    isSubmitting?: boolean;
    onSubmit: (values: CustomerAddressFormValues) => void | Promise<void>;
    onCancel?: () => void;
};

export default function CustomerAddressForm({
    mode,
    defaultValues,
    isSubmitting = false,
    onSubmit,
    onCancel,
}: CustomerAddressFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CustomerAddressFormValues>({
        resolver: zodResolver(customerAddressSchema),
        defaultValues: {
            addressType: defaultValues?.addressType || "HOME",
            name: defaultValues?.name || "",
            address: defaultValues?.address || "",
            city: defaultValues?.city || "",
            country: defaultValues?.country || "Bangladesh",
            isDefault: defaultValues?.isDefault ?? false,
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                addressType: defaultValues.addressType || "HOME",
                name: defaultValues.name || "",
                address: defaultValues.address || "",
                city: defaultValues.city || "",
                country: defaultValues.country || "Bangladesh",
                isDefault: defaultValues.isDefault ?? false,
            });
        }
    }, [defaultValues, reset]);

    const isUpdate = mode === "update";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                    Address Type
                </label>

                <select
                    {...register("addressType")}
                    className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)]"
                >
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="SHIPPING">Shipping</option>
                    <option value="BILLING">Billing</option>
                    <option value="OTHER">Other</option>
                </select>

                {errors.addressType && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.addressType.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                    Address Name
                </label>

                <div className="relative">
                    <Home className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted,#6b7280)]" />

                    <input
                        {...register("name")}
                        placeholder="Home"
                        className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                    />
                </div>

                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                    Full Address
                </label>

                <div className="relative">
                    <MapPin className="absolute left-4 top-4 size-5 text-[var(--store-muted,#6b7280)]" />

                    <textarea
                        {...register("address")}
                        placeholder="House 42, Road 7, Dhanmondi"
                        rows={4}
                        className="w-full resize-none rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent py-3 pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                    />
                </div>

                {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                        City
                    </label>

                    <input
                        {...register("city")}
                        placeholder="Dhaka"
                        className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                    />

                    {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                        Country
                    </label>

                    <input
                        {...register("country")}
                        placeholder="Bangladesh"
                        className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent px-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                    />

                    {errors.country && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.country.message}
                        </p>
                    )}
                </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--store-border,#e5e7eb)] p-4">
                <input
                    type="checkbox"
                    {...register("isDefault")}
                    className="size-5 accent-[var(--store-primary,#f16d59)]"
                />

                <div>
                    <p className="text-sm font-semibold text-[var(--store-text,#111827)]">
                        Set as default address
                    </p>
                    <p className="text-xs text-[var(--store-muted,#6b7280)]">
                        This address will be selected automatically during checkout.
                    </p>
                </div>
            </label>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--store-border,#e5e7eb)] px-6 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <Save className="size-5" />
                    )}

                    {isSubmitting
                        ? isUpdate
                            ? "Updating..."
                            : "Creating..."
                        : isUpdate
                            ? "Update Address"
                            : "Create Address"}
                </button>
            </div>
        </form>
    );
}