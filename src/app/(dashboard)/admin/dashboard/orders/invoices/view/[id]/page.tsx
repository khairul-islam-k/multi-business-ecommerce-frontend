"use client";

import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  Receipt,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useOrderInvoice } from "@/lib/api/hooks/invoice";
import { useAuthStore } from "@/stores/auth.store";
import type {
  InvoiceItem,
  InvoicePayment,
  InvoiceTenantResponse,
} from "@/types/invoice/invoice";

type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

type PaymentStatus =
  | "PENDING"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

const getInvoiceStatusColor = (status?: string) => {
  const colors: Record<InvoiceStatus, string> = {
    DRAFT: "default",
    ISSUED: "blue",
    PARTIALLY_PAID: "orange",
    PAID: "green",
    OVERDUE: "red",
    CANCELLED: "default",
  };

  return colors[status as InvoiceStatus] ?? "default";
};

const getPaymentStatusColor = (status?: string) => {
  const colors: Record<PaymentStatus, string> = {
    PENDING: "orange",
    UNPAID: "red",
    PARTIALLY_PAID: "gold",
    PAID: "green",
    FAILED: "red",
    REFUNDED: "purple",
    PARTIALLY_REFUNDED: "purple",
  };

  return colors[status as PaymentStatus] ?? "default";
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "৳0";

  return `৳${Number(value).toLocaleString("en-BD")}`;
};

export default function InvoiceDetails() {
  const router = useRouter();
  const { message } = App.useApp();

  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const business = useAuthStore((s) => s.selectedBusiness);
  const businessId = business?.id ?? "";

  const { id } = useParams<{ id: string }>();

  const {
    data: invoice,
    isLoading,
    isFetching,
  } = useOrderInvoice(businessId, id);

  const invoiceData =
    ((invoice as { data?: InvoiceTenantResponse })?.data ??
      invoice) as InvoiceTenantResponse | undefined;

  const handleDownload = async () => {
    if (!invoiceRef.current || !invoiceData) return;

    try {
      setDownloading(true);

      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: 8,
        filename: `${invoiceData.invoiceNo}.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
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

  const itemColumns: TableColumnsType<InvoiceItem> = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      render: (value) => <span className="text-xs">{value}</span>,
    },
    {
      title: "Variant ID",
      dataIndex: "variantId",
      key: "variantId",
      render: (value) => value ?? "-",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (value) => formatMoney(value),
    },
    {
      title: "Discount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (value) => formatMoney(value),
    },
    {
      title: "Tax",
      dataIndex: "taxAmount",
      key: "taxAmount",
      render: (value) => formatMoney(value),
    },
    {
      title: "Line Total",
      dataIndex: "lineTotal",
      key: "lineTotal",
      render: (value) => <strong>{formatMoney(value)}</strong>,
    },
  ];

  const paymentColumns: TableColumnsType<InvoicePayment> = [
    {
      title: "Payment No",
      dataIndex: "paymentNo",
      key: "paymentNo",
      render: (value) => <strong>{value}</strong>,
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (value) => (
        <Tag color={getPaymentStatusColor(value)}>{value}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => <strong>{formatMoney(value)}</strong>,
    },
    {
      title: "Transaction Ref",
      dataIndex: "transactionReference",
      key: "transactionReference",
      render: (value) => value ?? "-",
    },
    {
      title: "Paid At",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (value) => formatDateTime(value),
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="space-y-6">
        <PageHeader title="Invoice Details" breadcrumb={adminBreadcrumb} />

        <Card>
          <Empty description="Invoice not found" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Details"
        subtitle={`Invoice No: ${invoiceData.invoiceNo}`}
        breadcrumb={adminBreadcrumb}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button icon={<ArrowLeft size={16} />} onClick={() => router.back()}>
          Back
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button icon={<Printer size={16} />} onClick={() => window.print()}>
            Print
          </Button>

          <Button
            type="primary"
            icon={<Download size={16} />}
            loading={downloading}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>

      <div ref={invoiceRef} className="bg-white p-4">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="m-0 text-2xl font-bold">Invoice</h1>
              <p className="m-0 mt-1 text-gray-500">
                {invoiceData.invoiceNo}
              </p>
            </div>

            <Tag
              color={getInvoiceStatusColor(invoiceData.status)}
              className="px-3 py-1 text-sm"
            >
              {invoiceData.status}
            </Tag>
          </div>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Total Amount"
                value={formatMoney(invoiceData.totalAmount)}
                prefix={<Receipt size={18} />}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Paid Amount"
                value={formatMoney(invoiceData.paidAmount)}
                prefix={<FileText size={18} />}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Subtotal"
                value={formatMoney(invoiceData.subtotal)}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Items"
                value={invoiceData.items?.length ?? 0}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>Invoice Information</span>
                </div>
              }
              className="h-full"
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Invoice No">
                  <strong>{invoiceData.invoiceNo}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="Invoice Date">
                  {formatDate(invoiceData.invoiceDate)}
                </Descriptions.Item>

                <Descriptions.Item label="Due Date">
                  {formatDate(invoiceData.dueDate)}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={getInvoiceStatusColor(invoiceData.status)}>
                    {invoiceData.status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Note">
                  {invoiceData.note ?? "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>Customer Information</span>
                </div>
              }
              className="h-full"
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Customer Name">
                  {invoiceData.customerName}
                </Descriptions.Item>

                <Descriptions.Item label="Phone">
                  {invoiceData.customerPhone}
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                  {invoiceData.customerEmail}
                </Descriptions.Item>

                <Descriptions.Item label="Billing Address">
                  {invoiceData.billingAddressSnapshot?.address ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Customer Status">
                  <Tag
                    color={
                      invoiceData.customer?.status === "ACTIVE"
                        ? "green"
                        : "red"
                    }
                  >
                    {invoiceData.customer?.status ?? "-"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Card title="Order Information" className="mt-4">
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
            <Descriptions.Item label="Order No">
              <strong>{invoiceData.order?.orderNo ?? "-"}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="Order Type">
              {invoiceData.order?.orderType ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Order Source">
              {invoiceData.order?.orderSource ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Order Status">
              {invoiceData.order?.status ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Payment Status">
              <Tag color={getPaymentStatusColor(invoiceData.order?.paymentStatus)}>
                {invoiceData.order?.paymentStatus ?? "-"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Is COD">
              {invoiceData.order?.isCod ? "Yes" : "No"}
            </Descriptions.Item>

            <Descriptions.Item label="Shipping Address">
              {invoiceData.order?.shippingAddressSnapshot?.address ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Order Note">
              {invoiceData.order?.note ?? "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Invoice Items" className="mt-4">
          <Table
            rowKey="id"
            columns={itemColumns}
            dataSource={invoiceData.items ?? []}
            pagination={false}
            scroll={{ x: 900 }}
          />
        </Card>

        <Card title="Payment Information" className="mt-4">
          <Table
            rowKey="id"
            columns={paymentColumns}
            dataSource={invoiceData.payments ?? []}
            pagination={false}
            scroll={{ x: 900 }}
          />
        </Card>

        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} lg={12}>
            <Card title="Tax Information" className="h-full">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Tax Name">
                  {invoiceData.tax?.name ?? "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Tax Rate">
                  {invoiceData.tax?.rate ?? invoiceData.taxRate}%
                </Descriptions.Item>

                <Descriptions.Item label="Description">
                  {invoiceData.tax?.description ?? "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Amount Summary" className="h-full">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>{formatMoney(invoiceData.subtotal)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <strong>{formatMoney(invoiceData.discountTotal)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <strong>{formatMoney(invoiceData.taxTotal)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Charge</span>
                  <strong>{formatMoney(invoiceData.shippingCharge)}</strong>
                </div>

                <Divider className="my-2" />

                <div className="flex justify-between text-lg">
                  <span>Total Amount</span>
                  <strong>{formatMoney(invoiceData.totalAmount)}</strong>
                </div>

                <div className="flex justify-between text-lg text-green-600">
                  <span>Paid Amount</span>
                  <strong>{formatMoney(invoiceData.paidAmount)}</strong>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}