"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import {
    useTemplateAreasQuery,
    useTemplateCourierMutation,
    useTemplateCourierQuery,
    useTemplateZones,
} from "@/lib/api/hooks/template-courier";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import {
    CourierChargeCalculationResponse,
    CourierDeliveryPayload,
    PathaoZone,
} from "@/types/courier/courier";
import { contentQuotesLinter } from "@ant-design/cssinjs/lib/linters";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Loader2,
    MapPin,
    MessageSquare,
    Package,
    Truck,
    X,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type CourierArea = {
    city_id: number;
    city_name: string;
    post_code: number;
    district_name: string;
    division_name: string;
    zone_id: number;
};

const courierSelectSchema = z.object({
    configId: z.string().min(1, "Courier is required"),
    deliveryCityId: z.string().min(1, "Area is required"),
    weight: z.number().optional(),
    specialInstruction: z.string().optional(),
    deliveryZoneId: z.string().optional(),
});

export type CourierSelectFormValues = z.infer<typeof courierSelectSchema>;

type CourierSellectModalProps = {
    weight: string;
    open: boolean;
    onClose: () => void;
    onSuccess: (data: CourierDeliveryPayload) => void;
    setCourierConfigId: Dispatch<SetStateAction<string>>;
};

const CourierSellectModal = ({
    weight,
    open,
    onClose,
    onSuccess,
    setCourierConfigId
}: CourierSellectModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [charge, setCharge] = useState<CourierChargeCalculationResponse | undefined>(undefined);

    const [selectedPayload, setSelectedPayload] = useState<
        CourierDeliveryPayload | undefined
    >(undefined);

    const message = useMessage();

    const { data: courierConfig, isLoading: isCourierLoading } =
        useTemplateCourierQuery();

        // create api
    const { courierChargeCalculate } = useTemplateCourierMutation();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        trigger,
        resetField,
        formState: { errors, touchedFields, isSubmitted },
    } = useForm<CourierSelectFormValues>({
        resolver: zodResolver(courierSelectSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            configId: "",
            deliveryCityId: "",
            weight: Number(weight),
            specialInstruction: "",
            deliveryZoneId: "",
        },
    });

    const selectedConfigId = watch("configId");
    const selectedCitiesId = watch("deliveryCityId");

    // get area
    const { data: areasResponse, isLoading: isAreaLoading } =
        useTemplateAreasQuery(selectedConfigId);

    // get cities
    const {data: zones} = useTemplateZones(selectedConfigId, selectedCitiesId);

    const allZones = (zones?.data?.data ?? []) as PathaoZone[];

    const zonesOptions = useMemo(() => {
        return allZones.map((area) => ({
            label: area.zone_name,
            value: String(area.zone_id),
        }));
    }, [allZones]);

    const courierConfigs = useMemo(() => {
        return (courierConfig ?? []);
    }, [courierConfig]);

    const cities = useMemo<CourierArea[]>(() => {
        return (areasResponse?.data.areas ?? []) as CourierArea[];
    }, [areasResponse]);

    // single courier config
    const selectCourier = courierConfig?.find(singleConfig => singleConfig.id === selectedConfigId);

    const isPathao = selectCourier?.courier.code ==="PATHAO";

    const configRegister = register("configId");
    const areaRegister = register("deliveryCityId");
    const specialInstructionRegister = register("specialInstruction");
    const zoneRegister = register("deliveryZoneId");

    const courierOptions = useMemo(() => {
        return courierConfigs.map((config) => ({
            label: `${config.courier?.name ?? "Courier"} ${config.mode ? `(${config.mode})` : ""
                }`,
            value: config.id,
            courierId: config.courierId,
        }));
    }, [courierConfigs]);

    const citiesOptions = useMemo(() => {
        return cities.map((area) => ({
            label: `${area.city_name}`,
            value: String(area.city_id),
        }));
    }, [cities]);

    const handleClose = () => {
        setCharge(undefined);
        setSelectedPayload(undefined);
        onClose();
    };


    // real time message

    const handleCourierChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        await configRegister.onChange(event);

        setCharge(undefined);
        setSelectedPayload(undefined);

        resetField("deliveryCityId", {
            defaultValue: "",
            keepDirty: false,
            keepTouched: false,
            keepError: false,
        });

        setValue("deliveryCityId", "", {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });

        clearErrors("deliveryCityId");
    };

    const handleAreaChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        await areaRegister.onChange(event);

        setCharge(undefined);
        setSelectedPayload(undefined);

        if (event.target.value) {
            clearErrors("deliveryCityId");
        }

        await trigger("deliveryCityId");
    };

    const handleZoneChange = async (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        await zoneRegister.onChange(event);

        setCharge(undefined);
        setSelectedPayload(undefined);

        if (event.target.value) {
            clearErrors("deliveryZoneId");
        }

        await trigger("deliveryZoneId");
    };

    const handleCourierCalculate = async (values: CourierSelectFormValues) => {
        try {
            setIsSubmitting(true);

            const selectedArea = cities.find(
                (area) => String(area.city_id) === values.deliveryCityId,
            );

            if (!selectedArea) {
                message.error("Please select a valid delivery area");
                return;
            }

            const specialInstruction = values.specialInstruction?.trim();

            const payload: CourierDeliveryPayload = {
                deliveryCityId: String(selectedArea.city_id),
                deliveryAreaName: selectedArea.city_name,
                deliveryPostCode: String(selectedArea.post_code),
                deliveryDivisionName: selectedArea.district_name,
                weight: values.weight ?? 1,
                ...(isPathao && values.deliveryZoneId
                    ? {
                       deliveryZoneId: String(values.deliveryZoneId),
                    }
                 : {}),
            };

            if (specialInstruction) {
                payload.specialInstruction = specialInstruction;
            }

            const res = await courierChargeCalculate.mutateAsync({
                configId: selectedConfigId,
                payload,
            });

            setCharge(res as CourierChargeCalculationResponse);
            setSelectedPayload(payload);

            message.success("Courier charge calculated successfully");
        } catch (error) {
            message.error(getWebErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = () => {
        if (!selectedPayload) return;

        onSuccess(selectedPayload);
        setCourierConfigId(selectedConfigId);
        handleClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-4">
            <button
                type="button"
                onClick={handleClose}
                className="absolute inset-0 bg-black/50"
                aria-label="Close modal"
            />

            <div className="relative z-10 flex h-[calc(100dvh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-[var(--store-bg-1)] shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-[var(--store-border)] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-full bg-[var(--store-bg-1)] text-[var(--store-primary)]">
                            <Truck className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[var(--store-text)]">
                                Courier Delivery
                            </h2>

                            <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                Select courier, delivery area and calculate charge.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="grid size-9 place-items-center rounded-full bg-[var(--store-bg-3)] transition hover:bg-red-500 hover:text-white"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <form
                        onSubmit={handleSubmit(handleCourierCalculate)}
                        className="space-y-5 p-6"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Courier
                            </label>

                            <div className="relative">
                                <Truck className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted,#6b7280)]" />

                                <select
                                    name={configRegister.name}
                                    ref={configRegister.ref}
                                    onBlur={configRegister.onBlur}
                                    onChange={handleCourierChange}
                                    disabled={isCourierLoading}
                                    className="h-12 w-full rounded-xl border border-[var(--store-border)] bg-transparent pl-12 pr-4 text-sm text-[var(--store-text)] outline-none transition focus:border-[var(--store-primary,#f16d59)] focus:bg-[var(--store-bg-1)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">
                                        {isCourierLoading ? "Loading couriers..." : "Select courier"}
                                    </option>

                                    {courierOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(touchedFields.configId || isSubmitted) && errors.configId && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.configId.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Delivery Area
                            </label>

                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted,#6b7280)]" />

                                <select
                                    name={areaRegister.name}
                                    ref={areaRegister.ref}
                                    onBlur={areaRegister.onBlur}
                                    onChange={handleAreaChange}
                                    disabled={!selectedConfigId || isAreaLoading}
                                    className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary)] focus:bg-[var(--store-bg-1)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">
                                        {!selectedConfigId
                                            ? "Select courier first"
                                            : isAreaLoading
                                                ? "Loading areas..."
                                                : "Select delivery area"}
                                    </option>

                                    {citiesOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(touchedFields.deliveryCityId || isSubmitted) &&
                                errors.deliveryCityId && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.deliveryCityId.message}
                                    </p>
                                )}
                        </div>

                        {
                            isPathao && <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Delivery Zone
                            </label>

                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted,#6b7280)]" />

                                <select
                                    name={zoneRegister.name}
                                    ref={zoneRegister.ref}
                                    onBlur={zoneRegister.onBlur}
                                    onChange={handleZoneChange}
                                    disabled={!selectedConfigId || isAreaLoading}
                                    className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary)] focus:bg-[var(--store-bg-1)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">
                                        {!selectedConfigId
                                            ? "Select courier first"
                                            : isAreaLoading
                                                ? "Loading areas..."
                                                : "Select delivery Zone"}
                                    </option>

                                    {zonesOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(touchedFields.deliveryCityId || isSubmitted) &&
                                errors.deliveryCityId && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.deliveryCityId.message}
                                    </p>
                                )}
                        </div>
                        }

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Weight
                            </label>

                            <div className="relative">
                                <Package className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--store-muted,#6b7280)]" />

                                <input
                                    type="number"
                                    step="any"
                                    inputMode="decimal"
                                    readOnly
                                    placeholder="1"
                                    {...register("weight", {
                                        setValueAs: (value) => {
                                            if (value === "" || value === null) return undefined;

                                            const numberValue = Number(value);

                                            if (Number.isNaN(numberValue)) return undefined;

                                            return numberValue;
                                        },
                                    })}
                                    className="h-12 w-full rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[var(--store-text,#111827)]">
                                Special Instruction{" "}
                                <span className="font-normal text-[var(--store-muted,#6b7280)]">
                                    (Optional)
                                </span>
                            </label>

                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 size-5 text-[var(--store-muted,#6b7280)]" />

                                <textarea
                                    name={specialInstructionRegister.name}
                                    ref={specialInstructionRegister.ref}
                                    onBlur={specialInstructionRegister.onBlur}
                                    onChange={specialInstructionRegister.onChange}
                                    rows={3}
                                    placeholder="Please call before delivery"
                                    className="w-full resize-none rounded-xl border border-[var(--store-border,#e5e7eb)] bg-transparent py-3 pl-12 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition placeholder:text-[var(--store-muted,#6b7280)] focus:border-[var(--store-primary,#f16d59)]"
                                />
                            </div>
                        </div>

                        {!charge && (
                            <div className="flex flex-col-reverse gap-3 border-t border-[var(--store-border,#e5e7eb)] pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleClose}
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
                                        <Truck className="size-5" />
                                    )}

                                    {isSubmitting ? "Calculating..." : "Calculate Charge"}
                                </button>
                            </div>
                        )}
                    </form>

                    {charge && (
                        <div className="px-6 pb-6">
                            <div className="rounded-3xl border border-[var(--store-border)] bg-[var(--store-card)] p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--store-border)] pb-4">
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            Courier Charge Summary
                                        </h3>
                                        <p className="text-s">
                                            Delivery charge calculated successfully.
                                        </p>
                                    </div>

                                    <div className="rounded-full bg-[var(--store-primary,#f16d59)]/10 px-4 py-2 text-sm font-bold text-[var(--store-primary)]">
                                        ৳{charge.courierFee}
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                                        <p className="text-xs font-medium text-[var(--store-muted,#6b7280)]">
                                            Shipping Charge
                                        </p>
                                        <p className="mt-1 text-xl font-bold text-[var(--store-text,#111827)]">
                                            ৳{charge.shippingCharge}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                                        <p className="text-xs font-medium text-[var(--store-muted,#6b7280)]">
                                            Delivery Charge
                                        </p>
                                        <p className="mt-1 text-xl font-bold text-[var(--store-text,#111827)]">
                                            ৳{charge.deliveryCharge}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                                        <p className="text-xs font-medium text-[var(--store-muted,#6b7280)]">
                                            COD Charge
                                        </p>
                                        <p className="mt-1 text-xl font-bold text-[var(--store-text,#111827)]">
                                            ৳{charge.codCharge}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[var(--store-bg-1)] p-4">
                                        <p className="text-xs font-medium text-[var(--store-muted,#6b7280)]">
                                            Weight
                                        </p>
                                        <p className="mt-1 text-xl font-bold text-[var(--store-text,#111827)]">
                                            {charge.weight} kg
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                    <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-4">
                                        <h4 className="mb-3 text-sm font-bold text-[var(--store-text,#111827)]">
                                            Pickup Warehouse
                                        </h4>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-[var(--store-muted,#6b7280)]">
                                                    Area
                                                </span>
                                                <span className="font-semibold text-[var(--store-text,#111827)]">
                                                    {charge.pickupWarehouse.areaName}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-[var(--store-muted,#6b7280)]">
                                                    Post Code
                                                </span>
                                                <span className="font-semibold text-[var(--store-text,#111827)]">
                                                    {charge.pickupWarehouse.PostCode}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-[var(--store-muted,#6b7280)]">
                                                    Pickup Store ID
                                                </span>
                                                <span className="font-semibold text-[var(--store-text,#111827)]">
                                                    {charge.pickupWarehouse.pickupStoreId}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-4">
                                        <h4 className="mb-3 text-sm font-bold text-[var(--store-text,#111827)]">
                                            Delivery Area
                                        </h4>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-[var(--store-muted,#6b7280)]">
                                                    Area
                                                </span>
                                                <span className="font-semibold text-[var(--store-text,#111827)]">
                                                    {charge.delivery.areaName}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-[var(--store-muted,#6b7280)]">
                                                    Post Code
                                                </span>
                                                <span className="font-semibold text-[var(--store-text,#111827)]">
                                                    {charge.delivery.postCode}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-[var(--store-muted,#6b7280)]">
                                                    Division
                                                </span>
                                                <span className="font-semibold text-[var(--store-text,#111827)]">
                                                    {charge.delivery.divisionName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[var(--store-border,#e5e7eb)] pt-5 sm:flex-row sm:items-center sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCharge(undefined);
                                            setSelectedPayload(undefined);
                                        }}
                                        className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--store-border,#e5e7eb)] px-6 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                                    >
                                        Recalculate
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleContinue}
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-6 text-sm font-semibold text-white transition hover:opacity-90"
                                    >
                                        Continue
                                        <ArrowRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourierSellectModal;