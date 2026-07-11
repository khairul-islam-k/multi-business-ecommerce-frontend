import { OrderSource, OrderStatus, OrderType } from "@/lib/api";
import { PaymentStatus } from "../template/template-payment";
import { PaymentMethod } from "../template/order-history";

export type CommonStatus = "ACTIVE" | "INACTIVE";

export type InvoiceStatus = 
  |"DRAFT"
  |"ISSUED"
  |"PARTIALLY_PAID"
  |"PAID"
  |"OVERDUE"
  |"CANCELLED";

export type AddressSnapshot = {
  address: string;
};

export type InvoiceOrder = {
  id: string;
  businessId: string;
  customerId: string;
  warehouseId: string;
  taxId: string;

  orderNo: string;
  orderType: OrderType;
  orderSource: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  isCod: boolean;

  customerName: string;
  customerPhone: string;
  customerEmail: string;

  shippingAddressSnapshot: AddressSnapshot;

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
};

export type InvoiceCustomer = {
  id: string;
  businessId: string;

  name: string;
  email: string;
  imageUrl: string | null;
  phone: string;
  status: CommonStatus;
  note: string | null;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type InvoiceTax = {
  id: string;
  businessId: string;

  name: string;
  rate: string;
  description: string | null;
  status: CommonStatus;

  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  orderItemId: string;
  productId: string;
  variantId: string | null;
  taxId: string;

  quantity: string;
  unitPrice: string;
  discountAmount: string;
  taxAmount: string;
  taxRate: string;
  lineTotal: string;

  createdAt: string;
  updatedAt: string;
};

export type AamarPayGatewayPayload = {
  ip?: string;
  date?: string;
  desc?: string;

  opt_a?: string;
  opt_b?: string;
  opt_c?: string;
  opt_d?: string;

  amount?: string;
  amount_bdt?: string;
  amount_currency?: string;
  amount_original?: string;

  currency?: string;
  currency_merchant?: string;

  cus_name?: string;
  cus_email?: string;
  cus_phone?: string;
  cus_add1?: string | null;
  cus_add2?: string | null;
  cus_city?: string | null;
  cus_state?: string | null;
  cus_country?: string | null;
  cus_postcode?: string | null;
  cus_fax?: string | null;

  ship_name?: string | null;
  ship_add1?: string | null;
  ship_add2?: string | null;
  ship_city?: string | null;
  ship_state?: string | null;
  ship_country?: string | null;
  ship_postcode?: string | null;

  pg_txnid?: string;
  mer_txnid?: string;
  bank_trxid?: string;
  gatewayTransactionId?: string;

  store_id?: string;
  merchant_id?: string;

  call_type?: string;
  payment_type?: string;
  payment_processor?: string;
  pay_status?: string;

  cardnumber?: string;
  bin_issuer?: string;
  bin_country?: string;
  bin_cardtype?: string;
  bin_cardcategory?: string;

  status_code?: string;
  status_title?: string;
  error_code?: string;
  error_title?: string;

  approval_code?: string;
  verify_status?: string;
  checkout_status?: string;
  date_processed?: string;

  rec_amount?: string;
  store_amount?: string;
  processing_ratio?: string;
  processing_charge?: string;
  convertion_rate?: string;

  risk_level?: string;
  risk_title?: string;
  doc_recived?: string;
  email_send?: string;

  [key: string]: unknown;
};

export type InvoicePayment = {
  id: string;
  businessId: string;
  orderId: string;

  financeAccountId: string;
  gatewayId: string;
  gatewayConfigId: string;

  paymentNo: string;
  amount: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  transactionReference: string | null;
  gatewayTransactionId: string | null;
  gatewaySessionId: string | null;
  gatewayEventId: string | null;

  gatewayPayload: AamarPayGatewayPayload | Record<string, unknown>;

  paidAt: string | null;

  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceTenantResponse = {
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

  order: InvoiceOrder;
  customer: InvoiceCustomer;
  tax: InvoiceTax;
  items: InvoiceItem[];
  payments: InvoicePayment[];
};