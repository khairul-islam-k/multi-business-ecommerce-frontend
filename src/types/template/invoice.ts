import { ListQuery } from "@/lib/api";
import { CustomerStatus } from "../customer/customer";
import { TaxStatus } from "../suppliers/return";
import { OrderSource, OrderStatus, OrderType, PaymentStatus } from "./template-payment";

export type DecimalString = string;
export type DateString = string;
export type Nullable<T> = T | null;

export type InvoiceStatus = 
  |"DRAFT"
  |"ISSUED"
  |"PARTIALLY_PAID"
  |"PAID"
  |"OVERDUE"
  |"CANCELLED";

export type AddressSnapshot = {
  address: string;
  city?: string;
  name?: string;
  country?: string;
  addressId?: string;
  addressType?: string;
};

export type CustomerInvoiceResponse = {
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
  items: InvoiceItem[];
  payments: InvoicePayment[];
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

export type InvoiceCustomer = {
  id: string;
  businessId: string;
  name: string;
  email: string;
  imageUrl: Nullable<string>;
  phone: string;
  status: CustomerStatus;
  note: Nullable<string>;

  createdBy: Nullable<string>;
  updatedBy: Nullable<string>;
  deletedBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
  deletedAt: Nullable<DateString>;
};

export type InvoiceTax = {
  id: string;
  businessId: string;
  name: string;
  rate: DecimalString;
  description: string;
  status: TaxStatus;

  createdBy: Nullable<string>;
  updatedBy: Nullable<string>;
  deletedBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
  deletedAt: Nullable<DateString>;
};

export type InvoiceItem = {
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

export type InvoicePayment = {
  id: string;
  businessId: string;
  orderId: string;
  financeAccountId: string;
  gatewayId: string;
  gatewayConfigId: string;

  paymentNo: string;
  amount: DecimalString;
  paymentMethod: string;
  paymentStatus: PaymentStatus;

  transactionReference: Nullable<string>;
  gatewayTransactionId: Nullable<string>;
  gatewaySessionId: Nullable<string>;
  gatewayEventId: Nullable<string>;

  gatewayPayload: GatewayPayloadItem[];

  paidAt: Nullable<DateString>;
  createdBy: Nullable<string>;
  createdAt: DateString;
  updatedAt: DateString;
};

export type GatewayPayloadItem = {
  id: number;
  city: string;
  name: string;
  email: string;
  amount: DecimalString;
  method: string;

  value1: Nullable<string>;
  value2: Nullable<string>;
  value3: Nullable<string>;
  value4: Nullable<string>;

  address: string;
  sp_code: string;
  usd_amt: DecimalString;
  currency: string;
  order_id: string;
  phone_no: string;
  usd_rate: number;
  date_time: string;

  is_verify: number;
  invoice_no: string;
  sp_massage?: string;
  sp_message?: string;
  bank_status: string;
  bank_trx_id: string;

  card_number: Nullable<string>;
  disc_percent: number;
  payable_amount: DecimalString;
  recived_amount: DecimalString;
  discount_amount: DecimalString;
  card_holder_name: Nullable<string>;

  customer_order_id: string;
  transaction_status: string;
};

export type invoiceQuery = ListQuery & {
  status?: InvoiceStatus;
}