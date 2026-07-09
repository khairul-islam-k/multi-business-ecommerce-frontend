"use client";

import { useMessage } from "@/app/store/_components/message/message-hook";
import { useTemplatePaymentGateway, useTemplatePaymentMutation } from "@/lib/api/hooks/template-payment";
import { getWebErrorMessage } from "@/lib/public-api-hook/web-api";
import { PaymentGatewayProvider } from "@/types/payment-gateway";
import { CreditCard, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export type PaymentGatewayMode = "SANDBOX" | "LIVE";

export type PaymentGateway = {
    id: string;
    gatewayId: string;
    code: PaymentGatewayProvider;
    name: PaymentGatewayProvider;
    description: string;
    mode: PaymentGatewayMode;
};

type PaymentGatewayModalProps = {
    open: boolean;
    orderId: string;
    onClose: () => void;
};

export default function PaymentGatewayModal({
    open,
    orderId,
    onClose,
}: PaymentGatewayModalProps) {
    const { data: gateways, isLoading, isFetching } = useTemplatePaymentGateway();
    const message = useMessage();

    const baseUrl = window.location.origin ?? '';

    const router = useRouter()

    const { createProvidePayment } = useTemplatePaymentMutation();

    if (!open) return null;

    const handleSelectGateway = async (gateway: PaymentGateway) => {
        console.log("selected gateway name:", gateway.code);

        if (!gateway.code) return;

        const payload = {
            provider: gateway.code,
            successRedirectUrl: `${baseUrl}/routes/payment`,
            failRedirectUrl: `${baseUrl}/routes/failed`,
            cancelRedirectUrl: `${baseUrl}/routes/cancel`
        }

        try {
            const res = await createProvidePayment.mutateAsync({
                orderId,
                payload
            });

            router.push(res?.redirectUrl)

            onClose();
        } catch (error) {
            message.error(getWebErrorMessage(error));
        }
    };

    const gatewayLength = gateways?.length ?? 0;
    const isGatewayLoading = isLoading || isFetching;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-3 py-5">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/50"
                aria-label="Close modal"
            />

            <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-[var(--store-card,#ffffff)] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--store-border,#e5e7eb)] px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                            <CreditCard className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-[var(--store-text,#111827)] sm:text-lg">
                                Select Payment Gateway
                            </h2>

                            <p className="text-xs text-[var(--store-muted,#6b7280)] sm:text-sm">
                                Choose your payment provider.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-8 place-items-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-red-500 hover:text-white"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="p-4">
                    {isGatewayLoading ? (
                        <div className="flex min-h-32 items-center justify-center">
                            <Loader2 className="size-6 animate-spin text-[var(--store-primary,#f16d59)]" />
                        </div>
                    ) : gatewayLength > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                            {gateways?.map((gateway) => (
                                <button
                                    key={gateway.id}
                                    type="button"
                                    onClick={() => handleSelectGateway(gateway)}
                                    className="group rounded-xl border border-[var(--store-border,#e5e7eb)] bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--store-primary,#f16d59)] hover:shadow-md"
                                >
                                    <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)] transition group-hover:bg-[var(--store-primary,#f16d59)] group-hover:text-white">
                                        <CreditCard className="size-5" />
                                    </div>

                                    <h3 className="truncate text-xs font-bold text-[var(--store-text,#111827)] sm:text-sm">
                                        {gateway.name}
                                    </h3>

                                    <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-4 text-red-500 sm:text-xs">
                                        {gateway.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[var(--store-border,#e5e7eb)] p-8 text-center">
                            <p className="text-sm font-medium text-[var(--store-muted,#6b7280)]">
                                No payment gateway found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}