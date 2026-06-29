"use client";

import {
  Download,
  Printer,
  Send
} from "lucide-react";


import Link from "next/link";
import { Button, Card } from "antd";
import { useParams } from "next/navigation";

import StatusBadge from "../_components/badge";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

export default function InvoiceDetails() {
  const { id } = useParams();

  const invoice = {
    invoiceNo: `INV-${id}`,
    customer: "Acme Corporation Ltd.",
    email: "billing@acme.com",
    address: "742 Evergreen Terrace, Springfield, USA",
    issueDate: "2024-02-10",
    dueDate: "2024-03-10",
    status: "paid",
    items: [
      { description: "Website Development", qty: 1, rate: 50000 },
      { description: "Mobile App UI Design", qty: 2, rate: 15000 },
      { description: "Cloud Hosting (12 months)", qty: 1, rate: 12000 },
    ],
  };

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0,
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice ${invoice.invoiceNo}`}
        breadcrumb={adminBreadcrumb}
      />

      <div className="flex items-center justify-end gap-3">
        <Link href={`/admin/dashboard/invoices/preview/${id}`}>
          <Button icon={<Printer />}>Preview</Button>
        </Link>

        <Button icon={<Send />}>Send</Button>

        <Link href={`/admin/dashboard/invoices/preview/${id}`}>
          <Button type="primary" icon={<Download />}>
            Download
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="lg:col-span-2" title="Invoice Details">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-medium">{invoice.customer}</p>
              <p className="text-sm text-gray-500">{invoice.email}</p>
              <p className="text-sm text-gray-500">{invoice.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Issue Date</p>
                <p>{invoice.issueDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p>{invoice.dueDate}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Items</p>
              <div className="space-y-2">
                {invoice.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.description} (x{item.qty})
                    </span>
                    <span>₹{(item.qty * item.rate).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card title="Summary">
          <div className="space-y-2 text-sm">
            <p>
              Status: <StatusBadge status="paid" text="Paid" />
            </p>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
