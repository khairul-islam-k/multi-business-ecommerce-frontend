"use client";

import Pagination from "@/app/store/_components/pagination";
import { useTemplateInvoiceQuery } from "@/lib/api/hooks/template-invoice";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    Eye,
    FileText,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export type InvoiceStatus =
    | "DRAFT"
    | "ISSUED"
    | "PARTIALLY_PAID"
    | "PAID"
    | "OVERDUE"
    | "CANCELLED";

type InvoiceSortBy =
    | "invoiceNo"
    | "invoiceDate"
    | "dueDate"
    | "totalAmount"
    | "createdAt"
    | "updatedAt";

type SortOrder = "asc" | "desc";

type AddressSnapshot = {
    city?: string;
    name?: string;
    address?: string;
    country?: string;
    addressId?: string;
    addressType?: string;
};

type InvoiceItem = {
    id: string;
    businessId: string;
    orderId: string;
    customerId: string;
    taxId: string;
    invoiceNo: string;
    invoiceDate: string;
    dueDate: string | null;
    status: InvoiceStatus;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    billingAddressSnapshot: AddressSnapshot;
    subtotal: string;
    discountTotal: string;
    taxTotal: string;
    taxRate: string;
    shippingCharge: string;
    totalAmount: string;
    paidAmount: string;
    note: string | null;
    createdBy: string | null;
    deletedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    items: unknown[];
    payments: unknown[];
};

const statusOptions: Array<InvoiceStatus> = [
    "DRAFT",
    "ISSUED",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
    "CANCELLED",
];

const sortByOptions: { label: string; value: InvoiceSortBy }[] = [
    { label: "Invoice No", value: "invoiceNo" },
    { label: "Invoice Date", value: "invoiceDate" },
    { label: "Due Date", value: "dueDate" },
    { label: "Total Amount", value: "totalAmount" },
    { label: "Created At", value: "createdAt" },
    { label: "Updated At", value: "updatedAt" },
];

const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const formatMoney = (value?: string | number | null) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 2,
    }).format(amount);
};

const getStatusClassName = (status: InvoiceStatus) => {
    switch (status) {
        case "PAID":
            return "bg-emerald-50 text-emerald-700 ring-emerald-200";
        case "ISSUED":
            return "bg-blue-50 text-blue-700 ring-blue-200";
        case "PARTIALLY_PAID":
            return "bg-amber-50 text-amber-700 ring-amber-200";
        case "OVERDUE":
            return "bg-orange-50 text-orange-700 ring-orange-200";
        case "CANCELLED":
            return "bg-red-50 text-red-700 ring-red-200";
        case "DRAFT":
        default:
            return "bg-slate-50 text-slate-700 ring-slate-200";
    }
};

const FashionInvoice = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [status, setStatus] = useState<InvoiceStatus>();
    const [sortBy, setSortBy] = useState<InvoiceSortBy>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { data: invoices, isLoading } = useTemplateInvoiceQuery({
        search: debouncedSearch,
        sortBy,
        sortOrder,
        status,
        limit,
        page: currentPage
    });

    const meta = invoices?.meta;

    const totalPages = meta?.totalPages ?? 1;
    const totalOrders = meta?.total ?? 0;

    const invoiceItems = useMemo(() => {
        return (invoices?.items ?? []) as InvoiceItem[];
    }, [invoices?.items]);

    const handleViewInvoice = (invoice: InvoiceItem) => {
        router.push(`/store/dashboard/invoice/detail/${invoice.id}`);
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <section className="overflow-hidden rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-card,#ffffff)] shadow-sm">
                <div className="border-b border-[var(--store-border,#e5e7eb)] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid size-11 place-items-center rounded-2xl bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                                <FileText className="size-5" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-[var(--store-text,#111827)]">
                                    My Invoices
                                </h1>
                                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                    View your invoice list and payment status.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                            Total: {totalOrders}
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search invoice, customer, phone..."
                                className="h-11 w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white pl-11 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)]"
                            />
                        </div>

                        <div className="relative">
                            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value as InvoiceStatus)
                                }
                                className="h-11 w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white pl-11 pr-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)]"
                            >
                                {statusOptions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value as InvoiceSortBy)
                            }
                            className="h-11 w-full rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white px-4 text-sm text-[var(--store-text,#111827)] outline-none transition focus:border-[var(--store-primary,#f16d59)]"
                        >
                            {sortByOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    Sort by {item.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() =>
                                setSortOrder((current) =>
                                    current === "asc" ? "desc" : "asc",
                                )
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-white px-4 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
                        >
                            {sortOrder === "asc" ? (
                                <ArrowDownAZ className="size-4" />
                            ) : (
                                <ArrowUpAZ className="size-4" />
                            )}

                            {sortOrder === "asc" ? "Ascending" : "Descending"}
                        </button>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-4 p-4 md:hidden">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-white p-4"
                            >
                                <div className="h-4 w-2/3 rounded bg-gray-100" />
                                <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
                                <div className="mt-5 h-10 rounded-full bg-gray-100" />
                            </div>
                        ))
                    ) : invoiceItems.length > 0 ? (
                        invoiceItems.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-[var(--store-muted,#6b7280)]">
                                            Invoice
                                        </p>
                                        <h3 className="mt-1 text-base font-bold text-[var(--store-text,#111827)]">
                                            {invoice.invoiceNo}
                                        </h3>
                                        <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                                            {formatDate(invoice.invoiceDate)}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClassName(
                                            invoice.status,
                                        )}`}
                                    >
                                        {invoice.status.replace("_", " ")}
                                    </span>
                                </div>

                                <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                                    <p className="text-xs font-medium text-[var(--store-muted,#6b7280)]">
                                        Total Amount
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-[var(--store-text,#111827)]">
                                        {formatMoney(invoice.totalAmount)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleViewInvoice(invoice)}
                                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                    View Invoice
                                    <Eye className="size-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-white p-8 text-center">
                            <div className="mx-auto grid size-12 place-items-center rounded-full bg-gray-100 text-gray-500">
                                <FileText className="size-6" />
                            </div>

                            <h3 className="mt-3 text-sm font-bold text-gray-900">
                                No invoices found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search, status, or sorting filters.
                            </p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px] text-left">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-5 py-4 font-bold">Invoice</th>
                                <th className="px-5 py-4 font-bold">Status</th>
                                <th className="px-5 py-4 text-right font-bold">Total</th>
                                <th className="px-5 py-4 text-right font-bold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="animate-pulse">
                                        {Array.from({ length: 4 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-5 py-4">
                                                <div className="h-4 rounded bg-gray-100" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : invoiceItems.length > 0 ? (
                                invoiceItems.map((invoice) => (
                                    <tr key={invoice.id} className="transition hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-[var(--store-text,#111827)]">
                                                {invoice.invoiceNo}
                                            </p>
                                            <p className="mt-1 text-xs text-[var(--store-muted,#6b7280)]">
                                                Date: {formatDate(invoice.invoiceDate)}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClassName(
                                                    invoice.status,
                                                )}`}
                                            >
                                                {invoice.status.replace("_", " ")}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right text-sm font-bold text-gray-900">
                                            {formatMoney(invoice.totalAmount)}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleViewInvoice(invoice)}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[var(--store-border,#e5e7eb)] px-4 text-sm font-semibold text-gray-600 transition hover:border-[var(--store-primary,#f16d59)] hover:bg-[var(--store-primary,#f16d59)]/10 hover:text-[var(--store-primary,#f16d59)]"
                                            >
                                                View
                                                <Eye className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center">
                                        <div className="mx-auto max-w-sm">
                                            <div className="mx-auto grid size-12 place-items-center rounded-full bg-gray-100 text-gray-500">
                                                <FileText className="size-6" />
                                            </div>

                                            <h3 className="mt-3 text-sm font-bold text-gray-900">
                                                No invoices found
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Try changing your search, status, or sorting filters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </section>
        </div>
    );
};

export default FashionInvoice;