import api from "../axios";
import { buildQueryString } from "./params";
import { normalizePaginatedResponse, unwrapApiResponse } from "./response";
import type {
  ApiId,
  ApiPaginatedResponse,
  ApiResponse,
  ListQuery,
} from "./types";

export type OrderType = "ONLINE" | "POS" | "ADMIN";
export type OrderSource = "WEBSITE" | "POS" | "ADMIN_PANEL" | "MOBILE_APP";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";
export type OrderPaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type OrderPaymentMethod =
  | "CASH"
  | "COD"
  | "BKASH"
  | "NAGAD"
  | "CARD"
  | "BANK_TRANSFER"
  | "OTHER";
export type OrderReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderItemPayload = {
  productId: ApiId;
  variantId?: ApiId;
  quantity: number;
  discountAmount?: number;
};

export type OrderPaymentPayload = {
  paymentMethod: OrderPaymentMethod;
  financeAccountId?: ApiId;
};

export type OrderCourierPayload = {
  courierId?: ApiId;
  deliveryZoneId?: ApiId;
  courierFee?: number;
  recipientName?: string;
  recipientPhone?: string;
  deliveryAddressSnapshot?: unknown;
};

export type OrderPayload = {
  customerId?: ApiId;
  warehouseId?: ApiId;
  orderType?: OrderType;
  orderSource?: OrderSource;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddressSnapshot?: unknown;
  shippingCharge?: number;
  note?: string;
  isCod?: boolean;
  items: OrderItemPayload[];
  payment?: OrderPaymentPayload;
  courier?: OrderCourierPayload;
};

export type OrderQuery = ListQuery & {
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  orderType?: OrderType;
};

export type OrderReturnQuery = ListQuery & {
  status?: OrderReturnStatus;
  orderId?: ApiId;
};

export type OrderItemResponse = {
  id: ApiId;
  orderId: ApiId;
  productId: ApiId;
  variantId?: ApiId | null;
  taxId?: ApiId | null;
  quantity?: string | number;
  unitPrice?: string | number;
  discountAmount?: string | number;
  taxAmount?: string | number;
  taxRate?: string | number;
  lineTotal?: string | number;
  product?: unknown;
  variant?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderPaymentResponse = {
  id: ApiId;
  businessId: ApiId;
  orderId: ApiId;
  financeAccountId?: ApiId | null;
  paymentNo?: string;
  amount?: string | number;
  paymentMethod?: OrderPaymentMethod;
  paymentStatus?: string;
  transactionReference?: string | null;
  paidAt?: string | null;
  createdBy?: ApiId | null;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderStatusLogResponse = {
  id: ApiId;
  orderId: ApiId;
  fromStatus?: OrderStatus | null;
  toStatus?: OrderStatus;
  note?: string | null;
  changedBy?: ApiId | null;
  createdAt?: string;
};

export type OrderResponse = {
  id: ApiId;
  businessId: ApiId;
  customerId?: ApiId | null;
  warehouseId?: ApiId | null;
  taxId?: ApiId | null;
  orderNo?: string;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  orderType?: OrderType;
  orderSource?: OrderSource;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  shippingCharge?: string | number | null;
  subtotal?: string | number | null;
  discountTotal?: string | number | null;
  taxTotal?: string | number | null;
  totalAmount?: string | number | null;
  paidAmount?: string | number | null;
  taxRate?: string | number | null;
  note?: string | null;
  shippingAddressSnapshot?: unknown;
  items?: OrderItemResponse[];
  payments?: OrderPaymentResponse[];
  statusLogs?: OrderStatusLogResponse[];
  existingCustomer?: unknown;
  customer?: unknown;
  warehouse?: unknown;
  tax?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderReturnItemResponse = {
  id: ApiId;
  returnId: ApiId;
  orderItemId: ApiId;
  productId: ApiId;
  variantId?: ApiId | null;
  quantity?: string | number;
  unitPrice?: string | number;
  lineTotal?: string | number;
  reason?: string | null;
  orderItem?: OrderItemResponse;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderReturnResponse = {
  id: ApiId;
  businessId: ApiId;
  orderId: ApiId;
  returnNo?: string;
  status?: OrderReturnStatus;
  reason?: string | null;
  totalAmount?: string | number | null;
  createdBy?: ApiId | null;
  approvedBy?: ApiId | null;
  deletedBy?: ApiId | null;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  order?: OrderResponse;
  items?: OrderReturnItemResponse[];
};

const basePath = (businessId: ApiId) =>
  `/orders/businesses/${businessId}/orders`;

export const ordersApi = {
  list(businessId: ApiId, query?: OrderQuery) {
    return api
      .get<ApiPaginatedResponse<OrderResponse>>(
        `${basePath(businessId)}${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  get(businessId: ApiId, orderId: ApiId) {
    return api
      .get<ApiResponse<OrderResponse>>(`${basePath(businessId)}/${orderId}`)
      .then((res) => unwrapApiResponse(res.data));
  },

  create(businessId: ApiId, payload: OrderPayload) {
    return api
      .post<ApiResponse<OrderResponse>>(basePath(businessId), payload)
      .then((res) => unwrapApiResponse(res.data));
  },

  addPayment(
    businessId: ApiId,
    orderId: ApiId,
    payload: OrderPaymentPayload,
  ) {
    return api
      .post<ApiResponse<OrderResponse>>(
        `${basePath(businessId)}/${orderId}/payments`,
        payload,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  ship(businessId: ApiId, orderId: ApiId) {
    return api
      .patch<ApiResponse<OrderResponse>>(`${basePath(businessId)}/${orderId}/ship`)
      .then((res) => unwrapApiResponse(res.data));
  },

  deliver(businessId: ApiId, orderId: ApiId) {
    return api
      .patch<ApiResponse<OrderResponse>>(
        `${basePath(businessId)}/${orderId}/deliver`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  cancel(businessId: ApiId, orderId: ApiId) {
    return api
      .patch<ApiResponse<OrderResponse>>(
        `${basePath(businessId)}/${orderId}/cancel`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  listReturns(businessId: ApiId, query?: OrderReturnQuery) {
    return api
      .get<ApiPaginatedResponse<OrderReturnResponse>>(
        `${basePath(businessId)}/returns${buildQueryString(query)}`,
      )
      .then((res) => normalizePaginatedResponse(res.data));
  },

  getReturn(businessId: ApiId, returnId: ApiId) {
    return api
      .get<ApiResponse<OrderReturnResponse>>(
        `${basePath(businessId)}/returns/${returnId}`,
      )
      .then((res) => unwrapApiResponse(res.data));
  },

  updateReturnStatus(
    businessId: ApiId,
    returnId: ApiId,
    status: OrderReturnStatus,
  ) {
    return api
      .patch<ApiResponse<OrderReturnResponse>>(
        `${basePath(businessId)}/returns/${returnId}/status`,
        { status },
      )
      .then((res) => unwrapApiResponse(res.data));
  },
};
