import {
  ArrowLeft,
  Ban,
  CreditCard,
  Home,
  ReceiptText,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";

type PaymentCancelPageProps = {
  searchParams: Promise<{
    orderId?: string | string[];
    transactionReference?: string | string[];
    reason?: string | string[];
  }>;
};

const getSearchParamValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function FashionPaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const params = await searchParams;

  const orderId = getSearchParamValue(params.orderId);
  const transactionId = getSearchParamValue(params.transactionReference);
  const reason = getSearchParamValue(params.reason);

  return (
    <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="bg-yellow-500 px-6 py-12 text-center text-white sm:px-10">
            <div className="mx-auto grid size-24 place-items-center rounded-full bg-white text-yellow-500 shadow-lg">
              <Ban className="size-14" />
            </div>

            <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
              Payment Cancelled
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              Your payment was cancelled. No payment has been completed for this
              order.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                <div className="mb-3 grid size-11 place-items-center rounded-full bg-yellow-100 text-yellow-700">
                  <Ban className="size-5" />
                </div>

                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                  Payment Status
                </p>

                <h3 className="mt-1 font-bold text-yellow-600">Cancelled</h3>
              </div>

              <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                <div className="mb-3 grid size-11 place-items-center rounded-full bg-blue-100 text-blue-700">
                  <ReceiptText className="size-5" />
                </div>

                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                  Order ID
                </p>

                <h3 className="mt-1 break-all font-bold text-[var(--store-text,#111827)]">
                  {orderId || "N/A"}
                </h3>
              </div>

              <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                <div className="mb-3 grid size-11 place-items-center rounded-full bg-orange-100 text-orange-700">
                  <CreditCard className="size-5" />
                </div>

                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                  Transaction ID
                </p>

                <h3 className="mt-1 break-all font-bold text-[var(--store-text,#111827)]">
                  {transactionId || "N/A"}
                </h3>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-yellow-50 p-5">
              <h2 className="text-lg font-bold text-yellow-700">
                Cancel Information
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-yellow-700">Status</span>

                  <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                    CANCELLED
                  </span>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-yellow-700">Reason</span>

                  <span className="text-sm font-semibold text-yellow-800">
                    {reason || "Payment was cancelled by the customer."}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/store"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--store-border,#e5e7eb)] px-6 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
              >
                <Home className="size-5" />
                Go Home
              </Link>

              <Link
                href="/store/cart"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-yellow-200 px-6 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-50"
              >
                <ArrowLeft className="size-5" />
                Back to Cart
              </Link>

              <Link
                href="/store/checkout"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-yellow-500 px-6 text-sm font-semibold text-white transition hover:bg-yellow-600"
              >
                <RefreshCcw className="size-5" />
                Try Payment Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}