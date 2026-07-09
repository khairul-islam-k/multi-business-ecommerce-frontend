import {
  ArrowRight,
  CheckCircle2,
  Home,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    orderId?: string | string[];
    paidAmount?: string | string[];
    transactionReference?: string | string[];
  }>;
};

const getSearchParamValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default async function FashionPaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const orderId = getSearchParamValue(params.orderId);
  const amount = getSearchParamValue(params.paidAmount);
  const transactionReference = getSearchParamValue(params.transactionReference);

  const cookieStore = await cookies();
  const website = cookieStore.get("website")?.value;

  console.log('website form cokie', website);

  return (
    <section className="min-h-screen bg-[var(--store-secondary,#f8f5f1)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl bg-[var(--store-card,#ffffff)] shadow-sm">
          <div className="bg-green-500 px-6 py-12 text-center text-white sm:px-10">
            <div className="mx-auto grid size-24 place-items-center rounded-full bg-white text-green-500 shadow-lg">
              <CheckCircle2 className="size-14" />
            </div>

            <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
              Payment Successful!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
              Thank you for your payment. Your order has been placed
              successfully.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--store-border,#e5e7eb)] p-5">
                <div className="mb-3 grid size-11 place-items-center rounded-full bg-green-100 text-green-700">
                  <PackageCheck className="size-5" />
                </div>

                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                  Order Status
                </p>

                <h3 className="mt-1 font-bold text-[var(--store-text,#111827)]">
                  Confirmed
                </h3>
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
                  <ShoppingBag className="size-5" />
                </div>

                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                  Paid Amount
                </p>

                <h3 className="mt-1 font-bold text-[var(--store-text,#111827)]">
                  {amount ? `৳${amount}` : "N/A"}
                </h3>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--store-secondary,#f8f5f1)] p-5">
              <h2 className="text-lg font-bold text-[var(--store-text,#111827)]">
                Payment Information
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-[var(--store-muted,#6b7280)]">
                    Payment Status
                  </span>

                  <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    SUCCESS
                  </span>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-[var(--store-muted,#6b7280)]">
                    Transaction Reference
                  </span>

                  <span className="break-all text-sm font-semibold text-[var(--store-text,#111827)]">
                    {transactionReference || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`${website}/store`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--store-border,#e5e7eb)] px-6 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
              >
                <Home className="size-5" />
                Go Home
              </Link>

              <Link
                href="/store/dashboard/orders"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View Orders
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}