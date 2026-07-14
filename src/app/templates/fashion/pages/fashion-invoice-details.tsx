"use client";

import { useTemplateInvoice } from "@/lib/api/hooks/template-invoice";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Download,
  FileText,
  MapPin,
  Package,
  Phone,
  Printer,
  User,
} from "lucide-react";
import { useMessage } from "@/app/store/_components/message/message-hook";

type Nullable<T> = T | null;
type DecimalString = string;
type DateString = string;

type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

type AddressSnapshot = {
  city?: string;
  name?: string;
  address?: string;
  country?: string;
  addressId?: string;
  addressType?: string;
};

type InvoiceCustomer = {
  id: string;
  businessId: string;
  name: string;
  email: string;
  imageUrl: Nullable<string>;
  phone: string;
  status: string;
  note: Nullable<string>;
  createdBy: Nullable<string>;
  updatedBy: Nullable<string>;
  deletedBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
  deletedAt: Nullable<DateString>;
};

type InvoiceTax = {
  id: string;
  businessId: string;
  name: string;
  rate: DecimalString;
  description: string;
  status: string;
  createdBy: Nullable<string>;
  updatedBy: Nullable<string>;
  deletedBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
  deletedAt: Nullable<DateString>;
};

type InvoiceOrder = {
  id: string;
  businessId: string;
  customerId: string;
  warehouseId: string;
  taxId: string;
  orderNo: string;
  orderType: string;
  orderSource: string;
  status: string;
  paymentStatus: string;
  isCod: boolean;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddressSnapshot: AddressSnapshot;
  subtotal: DecimalString;
  discountTotal: DecimalString;
  taxTotal: DecimalString;
  taxRate: DecimalString;
  shippingCharge: DecimalString;
  totalAmount: DecimalString;
  paidAmount: DecimalString;
  note: Nullable<string>;
  createdBy: Nullable<string>;
  deletedBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
  deletedAt: Nullable<DateString>;
};

type InvoiceLineItem = {
  id: string;
  invoiceId: string;
  orderItemId: string;
  productId: string;
  variantId: Nullable<string>;
  taxId: string;
  quantity: DecimalString;
  unitPrice: DecimalString;
  discountAmount: DecimalString;
  taxAmount: DecimalString;
  taxRate: DecimalString;
  lineTotal: DecimalString;
  createdAt: DateString;
  updatedAt: DateString;
};

type InvoicePayment = {
  id: string;
  businessId: string;
  orderId: string;
  financeAccountId: string;
  gatewayId: string;
  gatewayConfigId: string;
  paymentNo: string;
  amount: DecimalString;
  paymentMethod: string;
  paymentStatus: string;
  transactionReference: Nullable<string>;
  gatewayTransactionId: Nullable<string>;
  gatewaySessionId: Nullable<string>;
  gatewayEventId: Nullable<string>;
  gatewayPayload: unknown[];
  paidAt: Nullable<DateString>;
  createdBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
};

type InvoiceDetails = {
  id: string;
  businessId: string;
  orderId: string;
  customerId: string;
  taxId: string;
  invoiceNo: string;
  invoiceDate: DateString;
  dueDate: Nullable<DateString>;
  status: InvoiceStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  billingAddressSnapshot: AddressSnapshot;
  subtotal: DecimalString;
  discountTotal: DecimalString;
  taxTotal: DecimalString;
  taxRate: DecimalString;
  shippingCharge: DecimalString;
  totalAmount: DecimalString;
  paidAmount: DecimalString;
  note: Nullable<string>;
  createdBy: Nullable<string>;
  deletedBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
  deletedAt: Nullable<DateString>;
  order: InvoiceOrder;
  customer: InvoiceCustomer;
  tax: InvoiceTax;
  items: InvoiceLineItem[];
  payments: InvoicePayment[];
};

type InvoiceDetailsResponse = InvoiceDetails | { data: InvoiceDetails };

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

const getStatusClassName = (status?: string) => {
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

const DetailCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="pdf-avoid-break rounded-2xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
        {icon}
        {label}
      </div>

      <div className="text-sm font-semibold text-[var(--store-text,#111827)]">
        {value}
      </div>
    </div>
  );
};

const FashionInvoiceDetails = () => {
  const router = useRouter();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const message = useMessage();

  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const { data: invoiceDetails, isLoading } =
    useTemplateInvoice(invoiceId);

  const invoice = useMemo(() => {
    const response = invoiceDetails as
      | InvoiceDetailsResponse
      | undefined;

    if (!response) {
      return undefined;
    }

    if ("data" in response) {
      return response.data;
    }

    return response;
  }, [invoiceDetails]);

  const handleDownload = async () => {
    if (!invoiceRef.current || !invoice) {
      return;
    }

    try {
      setDownloading(true);

      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: [8, 8, 8, 8],

        filename: `${invoice.invoiceNo}.pdf`,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: invoiceRef.current.scrollWidth,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

        pagebreak: {
          mode: ["css", "legacy"],
          avoid: [".pdf-avoid-break", "tr"],
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      await html2pdf()
        .set(options)
        .from(invoiceRef.current)
        .save();

      message.success("Invoice downloaded successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-5">
          <div className="h-16 rounded-3xl bg-gray-100" />
          <div className="h-72 rounded-3xl bg-gray-100" />
          <div className="h-56 rounded-3xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-white p-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-gray-100 text-gray-500">
            <FileText className="size-7" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-[var(--store-text,#111827)]">
            Invoice not found
          </h1>

          <p className="mt-2 text-sm text-[var(--store-muted,#6b7280)]">
            The invoice details could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const billingAddress = invoice.billingAddressSnapshot;
  const shippingAddress = invoice.order?.shippingAddressSnapshot;
  const payment = invoice.payments?.[0];

  return (
    <>
      <style jsx global>{`
        #invoice-print-area {
          page-break-inside: auto;
          break-inside: auto;
        }

        #invoice-print-area table,
        #invoice-print-area thead,
        #invoice-print-area tbody {
          page-break-inside: auto;
          break-inside: auto;
        }

        #invoice-print-area tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .pdf-avoid-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .pdf-allow-break {
          page-break-inside: auto !important;
          break-inside: auto !important;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          body * {
            visibility: hidden;
          }

          #invoice-print-area,
          #invoice-print-area * {
            visibility: visible;
          }

          #invoice-print-area {
            position: absolute;
            inset: 0;
            width: 100%;
            margin: 0;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 print:p-0">
        <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] px-5 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] px-5 text-sm font-semibold text-[var(--store-text,#111827)] transition hover:border-[var(--store-primary,#f16d59)] hover:text-[var(--store-primary,#f16d59)]"
            >
              <Printer className="size-4" />
              Print
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--store-primary,#f16d59)] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="size-4" />
              {downloading ? "Downloading..." : "Download"}
            </button>
          </div>
        </div>

        <section
          id="invoice-print-area"
          ref={invoiceRef}
          className="rounded-3xl border border-[var(--store-border)] bg-[var(--store-card)] shadow-sm print:rounded-none print:border-none print:shadow-none"
        >
          <div className="border-b border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-3)] p-6 print:bg-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-[var(--store-primary,#f16d59)]/10 text-[var(--store-primary,#f16d59)]">
                    <FileText className="size-6" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Invoice
                    </p>

                    <h1 className="text-2xl font-bold text-[var(--store-text,#111827)]">
                      {invoice.invoiceNo}
                    </h1>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClassName(
                      invoice.status,
                    )}`}
                  >
                    {invoice.status.replace("_", " ")}
                  </span>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClassName(
                      invoice.order?.paymentStatus,
                    )}`}
                  >
                    Payment: {invoice.order?.paymentStatus ?? "-"}
                  </span>

                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 ring-1 ring-gray-200">
                    Order: {invoice.order?.orderNo ?? "-"}
                  </span>
                </div>
              </div>

              <div className="pdf-avoid-break rounded-3xl bg-[var(--store-bg-1)] p-5 text-left shadow-sm ring-1 ring-[var(--store-border,#e5e7eb)] lg:min-w-72 print:shadow-none">
                <p className="text-sm text-[var(--store-muted,#6b7280)]">
                  Total Amount
                </p>

                <p className="mt-1 text-3xl font-black text-[var(--store-text,#111827)]">
                  {formatMoney(invoice.totalAmount)}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[var(--store-muted,#6b7280)]">
                      Invoice Date
                    </p>

                    <p className="font-semibold text-[var(--store-text,#111827)]">
                      {formatDate(invoice.invoiceDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[var(--store-muted,#6b7280)]">
                      Due Date
                    </p>

                    <p className="font-semibold text-[var(--store-text,#111827)]">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pdf-allow-break space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DetailCard
                icon={<User className="size-4" />}
                label="Customer"
                value={
                  <div>
                    <p>{invoice.customerName}</p>

                    <p className="mt-1 text-xs font-normal text-[var(--store-muted,#6b7280)]">
                      {invoice.customerEmail}
                    </p>
                  </div>
                }
              />

              <DetailCard
                icon={<Phone className="size-4" />}
                label="Phone"
                value={invoice.customerPhone}
              />

              <DetailCard
                icon={<CalendarDays className="size-4" />}
                label="Created"
                value={formatDateTime(invoice.createdAt)}
              />

              <DetailCard
                icon={<CreditCard className="size-4" />}
                label="Payment"
                value={
                  payment?.paymentStatus ??
                  invoice.order?.paymentStatus ??
                  "-"
                }
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="pdf-avoid-break rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="size-5 text-[var(--store-primary,#f16d59)]" />

                  <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                    Billing Address
                  </h2>
                </div>

                <div className="space-y-2 text-sm text-[var(--store-muted,#6b7280)]">
                  <p className="font-semibold text-[var(--store-text,#111827)]">
                    {billingAddress?.name ?? invoice.customerName}
                  </p>

                  <p>{billingAddress?.address ?? "-"}</p>

                  <p>
                    {[billingAddress?.city, billingAddress?.country]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>

                  {billingAddress?.addressType && (
                    <p>Type: {billingAddress.addressType}</p>
                  )}
                </div>
              </div>

              <div className="pdf-avoid-break rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="size-5 text-[var(--store-primary,#f16d59)]" />

                  <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-2 text-sm text-[var(--store-muted,#6b7280)]">
                  <p className="font-semibold text-[var(--store-text,#111827)]">
                    {shippingAddress?.name ?? invoice.customerName}
                  </p>

                  <p>{shippingAddress?.address ?? "-"}</p>

                  <p>
                    {[shippingAddress?.city, shippingAddress?.country]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>

                  {shippingAddress?.addressType && (
                    <p>Type: {shippingAddress.addressType}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pdf-allow-break rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)]">
              <div className="pdf-avoid-break flex items-center gap-2 border-b border-[var(--store-border,#e5e7eb)] px-5 py-4">
                <Package className="size-5 text-[var(--store-primary,#f16d59)]" />

                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Invoice Items
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-bold">
                        Product
                      </th>

                      <th className="px-5 py-4 text-right font-bold">
                        Qty
                      </th>

                      <th className="px-5 py-4 text-right font-bold">
                        Unit Price
                      </th>

                      <th className="px-5 py-4 text-right font-bold">
                        Discount
                      </th>

                      <th className="px-5 py-4 text-right font-bold">
                        Tax
                      </th>

                      <th className="px-5 py-4 text-right font-bold">
                        Line Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {invoice.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[var(--store-text,#111827)]">
                            Product ID
                          </p>

                          <p className="mt-1 break-all text-xs text-[var(--store-muted,#6b7280)]">
                            {item.productId}
                          </p>

                          {item.variantId && (
                            <p className="mt-1 break-all text-xs text-[var(--store-muted,#6b7280)]">
                              Variant: {item.variantId}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold">
                          {item.quantity}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold">
                          {formatMoney(item.unitPrice)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold">
                          {formatMoney(item.discountAmount)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold">
                          {formatMoney(item.taxAmount)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-bold text-[var(--store-text,#111827)]">
                          {formatMoney(item.lineTotal)}
                        </td>
                      </tr>
                    ))}

                    {!invoice.items?.length && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-8 text-center text-sm text-[var(--store-muted,#6b7280)]"
                        >
                          No items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pdf-allow-break grid gap-5 lg:grid-cols-[1fr_380px]">
              <div className="rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] p-5">
                <h2 className="text-base font-bold text-[var(--store-text,#111827)]">
                  Payment Information
                </h2>

                {payment ? (
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-[var(--store-muted,#6b7280)]">
                        Payment No
                      </p>

                      <p className="font-semibold text-[var(--store-text,#111827)]">
                        {payment.paymentNo}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--store-muted,#6b7280)]">
                        Method
                      </p>

                      <p className="font-semibold text-[var(--store-text,#111827)]">
                        {payment.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--store-muted,#6b7280)]">
                        Transaction ID
                      </p>

                      <p className="break-all font-semibold text-[var(--store-text,#111827)]">
                        {payment.gatewayTransactionId ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--store-muted,#6b7280)]">
                        Paid At
                      </p>

                      <p className="font-semibold text-[var(--store-text,#111827)]">
                        {formatDateTime(payment.paidAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[var(--store-muted,#6b7280)]">
                    No payment information found.
                  </p>
                )}

                {invoice.note && (
                  <div className="mt-5 rounded-2xl bg-[var(--store-bg-1)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--store-muted,#6b7280)]">
                      Note
                    </p>

                    <p className="mt-1 break-words text-sm text-[var(--store-text,#111827)]">
                      {invoice.note}
                    </p>
                  </div>
                )}
              </div>

              <div className="pdf-avoid-break rounded-3xl border border-[var(--store-border,#e5e7eb)] bg-[var(--store-bg-1)] p-5">
                <h2 className="mb-4 text-base font-bold text-[var(--store-text,#111827)]">
                  Invoice Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--store-muted,#6b7280)]">
                      Subtotal
                    </span>

                    <span className="font-semibold text-[var(--store-text,#111827)]">
                      {formatMoney(invoice.subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--store-muted,#6b7280)]">
                      Discount
                    </span>

                    <span className="font-semibold text-[var(--store-text,#111827)]">
                      {formatMoney(invoice.discountTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--store-muted,#6b7280)]">
                      Tax ({invoice.taxRate}%)
                    </span>

                    <span className="font-semibold text-[var(--store-text,#111827)]">
                      {formatMoney(invoice.taxTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--store-muted,#6b7280)]">
                      Shipping
                    </span>

                    <span className="font-semibold text-[var(--store-text,#111827)]">
                      {formatMoney(invoice.shippingCharge)}
                    </span>
                  </div>

                  <div className="border-t border-[var(--store-border,#e5e7eb)] pt-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-base font-bold text-[var(--store-text,#111827)]">
                        Total
                      </span>

                      <span className="text-xl font-black text-[var(--store-text,#111827)]">
                        {formatMoney(invoice.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--store-muted,#6b7280)]">
                      Paid
                    </span>

                    <span className="font-semibold text-emerald-700">
                      {formatMoney(invoice.paidAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--store-muted,#6b7280)]">
                      Due
                    </span>

                    <span className="font-bold text-red-600">
                      {formatMoney(
                        Number(invoice.totalAmount) -
                          Number(invoice.paidAmount),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FashionInvoiceDetails;