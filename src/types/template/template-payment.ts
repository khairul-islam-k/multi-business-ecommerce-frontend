import { PaymentGatewayMode, PaymentGatewayProvider } from "../payment-gateway";
import { CustomerAddressType } from "./customer-address";

export type PaymentMethodStatus = "ONLINE" | "COD";

export type PaymentPayload =
    | {
        paymentMethod: PaymentMethodStatus;
        shippingAddressId: string;
        note?: string;
    }
    | {
        paymentMethod: PaymentMethodStatus;
        shippingAddressSnapshot: {
            address: string;
        };
        note?: string;
    };



export type PaymentInitPayload = {
    provider: PaymentGatewayProvider;
    successRedirectUrl: string;
    failRedirectUrl: string;
    cancelRedirectUrl: string;
};

export type PaymentInitResponse = {
    redirectUrl: string;
}

// order Response

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";

export type PaymentStatus =
    | "PENDING"
    | "UNPAID"
    | "PARTIALLY_PAID"
    | "PAID"
    | "FAILED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED";

export type OrderSource =
    | "WEBSITE"
    | "POS"
    | "ADMIN_PANEL"
    | "MOBILE_APP";

export type OrderType =
    | "ONLINE"
    | "POS"
    | "ADMIN";



export type OrderShippingAddressSnapshot = {
    address: string;
    addressId?: string;
    addressType?: CustomerAddressType;
    city?: string;
    country?: string;
    name?: string;
};

export type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
    variantId: string | null;
    taxId: string | null;

    quantity: string;
    unitPrice: string;
    discountAmount: string;
    taxRate: string;
    taxAmount: string;
    lineTotal: string;

    createdAt: string;
    updatedAt: string;
};

export type OrderStatusLog = {
    id: string;
    orderId?: string;
    status?: OrderStatus;
    note?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type OrderPayment = {
    id: string;
    orderId?: string;
    amount?: string;
    paymentMethod?: string;
    transactionId?: string | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type OrderReturn = {
    id: string;
    orderId?: string;
    returnNo?: string;
    amount?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type OrderResponse = {
    id: string;
    businessId: string;
    customerId: string;
    warehouseId: string;
    taxId: string | null;

    orderNo: string;
    orderSource: OrderSource;
    orderType: OrderType;

    customerName: string;
    customerEmail: string;
    customerPhone: string | null;

    subtotal: string;
    discountTotal: string;
    taxRate: string;
    taxTotal: string;
    shippingCharge: string;
    totalAmount: string;
    paidAmount: string;

    paymentStatus: PaymentStatus;
    status: OrderStatus;

    note: string | null;

    shippingAddressSnapshot: OrderShippingAddressSnapshot;

    items: OrderItem[];
    payments: OrderPayment[];
    returns: OrderReturn[];
    statusLogs: OrderStatusLog[];

    createdBy: string | null;
    deletedBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};


// gayment gateway

export type TemplatePaymentGatewayResponse = {
    id: string;
    gatewayId: string;
    code: PaymentGatewayProvider;
    name: PaymentGatewayProvider;
    description: string;
    mode: PaymentGatewayMode;
};


// verify response ssl

export type PaymentMethod = "CASH" | "CARD" | "MOBILE_BANKING" | "BANK_TRANSFER" | "OTHER";

export type PaymentGatewayPayload = {
  amount: string;
  status: string;
  val_id: string;
  card_no: string;
  tran_id: string;
  value_a: string;
  value_b: string;
  value_c: string;
  value_d: string;
  currency: string;
  base_fair: string;
  card_type: string;
  tran_date: string;
  APIConnect: string;
  card_brand: string;
  emi_amount: string;
  emi_issuer: string;
  gw_version: string;
  risk_level: string;
  risk_title: string;
  card_issuer: string;
  card_ref_id: string;
  offer_avail: number;
  bank_tran_id: string;
  store_amount: string;
  validated_on: string;
  campaign_code: string;
  card_category: string;
  currency_rate: string;
  currency_type: string;
  card_sub_brand: string;
  emi_instalment: string;
  account_details: string;
  currency_amount: string;
  discount_amount: string;
  emi_description: string;
  discount_remarks: string;
  isTokeizeSuccess: number;
  card_issuer_country: string;
  discount_percentage: string;
  card_issuer_country_code: string;
};

export type VerifyPaymentResponse = {
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

  transactionReference: string;
  gatewayTransactionId: string;
  gatewaySessionId: string;
  gatewayEventId: string;

  gatewayPayload: PaymentGatewayPayload;

  paidAt: string | null;
  createdBy: string | null;

  createdAt: string;
  updatedAt: string;
};