"use client";

import { Badge, Button, Typography } from "antd";
import {
  DownloadOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";

const { Text, Title } = Typography;

export default function InvoicePreview() {
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
      <PageHeader title="Invoice Preview" breadcrumb={adminBreadcrumb} />

      <div className="mb-6 flex justify-between">
        <Link href="/invoices">
          <span className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <ArrowLeftOutlined /> Back
          </span>
        </Link>

        <div className="flex gap-2">
          <Button icon={<PrinterOutlined />}>Print</Button>

          <Button type="primary" icon={<DownloadOutlined />}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto border border-gray-200 rounded-lg p-10 shadow-sm space-y-6">
        <div className="flex justify-between">
          <div className="space-y-1">
            <Title level={3}>INVOICE</Title>
            {/* Simplified layout */}
            <p className="text-sm text-gray-700">#ID: {id}</p>
          </div>
          <div className="flex flex-col text-right">
            <Title level={4}>Your Company Name</Title>
            <Text>123 Business St, Suite 100</Text>
            <Text>Dhaka 1215</Text>
            <Text>Contact: 01XXXXX34X1Z5</Text>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <p className="font-bold uppercase">Bill to</p>
            <Title level={5}>Acme Corp</Title>
            <Text>billing@acmecorp.com</Text>
            <Text>123, Business Lane, Dhaka 1208</Text>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              <span className="font-normal">Issue Date: </span>
              Jan 15, 2026
            </p>
            <p className="font-semibold">
              <span className="font-normal">Due Date: </span>
              Feb 15, 2026
            </p>
            <Badge status="success" text="Paid" />
          </div>
        </div>

        <div className="lg:col-span-2" title="Invoice Details">
          <div className="space-y-4">
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
        </div>

        {/* Summary */}
        <div title="Summary">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
