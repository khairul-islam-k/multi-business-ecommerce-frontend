import Link from "next/link";
import {
  Ban,
  CreditCard,
  LayoutDashboard,
  RotateCcw,
} from "lucide-react";

const CancelPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-50">
          <Ban className="size-11 text-amber-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
          Payment Cancelled
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          You cancelled the package payment process. No payment was completed,
          and your current subscription remains unchanged.
        </p>

        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-700">
            You can return to the package page and complete the payment whenever
            you are ready.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/dashboard/billing/upgrade-plan"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Link>

          <Link
            href="/admin/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <LayoutDashboard className="size-4" />
            Go to Dashboard
          </Link>
        </div>

        <Link
          href="/admin/dashboard/billing/upgrade-plan"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <CreditCard className="size-4" />
          View available packages
        </Link>
      </div>
    </main>
  );
};

export default CancelPage;