import { OrderSource, OrderStatus, PaymentMethodStatus, PaymentStatus } from "./template-payment";

export type ApiId = string;

export type OrderReturnStatus =
  |"REQUESTED"
  |"APPROVED"
  |"REJECTED"
  |"COMPLETED"
  |"CANCELLED";


export type ShippingAddressSnapshot = {
  address: string;
  city?: string;
  name?: string;
  country?: string;
};

export type CustomerReturnOrder = {
  id: ApiId;
  businessId: ApiId;
  customerId: ApiId;
  warehouseId: ApiId;
  taxId: ApiId | null;

  orderNo: string;
  orderType: PaymentMethodStatus;
  orderSource: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  isCod: boolean;

  customerName: string;
  customerPhone: string | null;
  customerEmail: string;

  shippingAddressSnapshot: ShippingAddressSnapshot;

  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  taxRate: string;
  shippingCharge: string;
  totalAmount: string;
  paidAmount: string;

  note: string | null;

  createdBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CustomerReturnItem = {
  id: ApiId;
  returnId: ApiId;
  orderItemId: ApiId;
  productId: ApiId;
  variantId: ApiId | null;

  quantity: string;
  unitPrice: string;
  lineTotal: string;
  reason: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CustomerOrderReturnItemResponse = {
  id: ApiId;
  businessId: ApiId;
  orderId: ApiId;

  returnNo: string;
  status: OrderReturnStatus;
  reason: string | null;
  totalAmount: string;

  createdBy: ApiId | null;
  approvedBy: ApiId | null;
  deletedBy: ApiId | null;

  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  items: CustomerReturnItem[];
  order: CustomerReturnOrder;
};