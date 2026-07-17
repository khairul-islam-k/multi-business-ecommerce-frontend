import Link from "next/link";
import { CheckCircle2, CreditCard, LayoutDashboard } from "lucide-react";

const PackagePayment = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="size-11 text-emerald-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
          Payment Successful
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          Your package payment has been completed successfully. Your selected
          subscription package is now active and ready to use.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <LayoutDashboard className="size-4" />
            Go to Dashboard
          </Link>

          <Link
            href="/admin/dashboard/billing/upgrade-plan"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <CreditCard className="size-4" />
            View Packages
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PackagePayment;