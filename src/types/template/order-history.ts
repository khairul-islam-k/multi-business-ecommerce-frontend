import { ListQuery } from "@/lib/api";
import { OrderSource, OrderStatus, PaymentMethodStatus, PaymentStatus } from "./template-payment";

export type ApiId = string;


export type PaymentMethod =
    | "CASH"
    | "COD"
    | "BKASH"
    | "NAGAD"
    | "CARD"
    | "BANK_TRANSFER"
    | "OTHER";

export type TemplateOrderQuery = ListQuery & {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus
};

export type AddressType = "BILLING" | "SHIPPING";

export type CustomerOrderShippingAddressSnapshot = {
    address: string;
    city?: string;
    name?: string;
    country?: string;
    addressId?: ApiId;
    addressType?: AddressType;
};

export type CustomerOrderItem = {
    id: ApiId;
    orderId: ApiId;
    productId: ApiId;
    variantId: ApiId | null;
    taxId: ApiId | null;

    quantity: string;
    unitPrice: string;
    discountAmount: string;
    taxAmount: string;
    taxRate: string;
    lineTotal: string;

    createdAt: string;
    updatedAt: string;
};


export type SSLCommerzGatewayItem = {
    gw: string;
    logo: string;
    name: string;
    type: string;
    r_flag?: string;
    redirectGatewayURL?: string;
};

export type SSLCommerzInitiationGatewayMap = {
    amex?: string;
    visa?: string;
    master?: string;
    othercards?: string;
    mobilebanking?: string;
    internetbanking?: string;
};

export type SSLCommerzInitiationPayload = {
    initiation: {
        gw: SSLCommerzInitiationGatewayMap;
        desc: SSLCommerzGatewayItem[];
        status: string;
        storeLogo: string;
        ip_address: string;
        sessionkey: string;
        store_name: string;
        storeBanner: string;
        failedreason: string;
        BQRPaymentURL: string;
        GatewayPageURL: string;
        directPaymentURL: string;
        redirectGatewayURL: string;
        directPaymentURLBank: string;
        directPaymentURLCard: string;
        is_direct_pay_enable: string;
        redirectGatewayURLFailed: string;
    };
    requestedRedirects: {
        failRedirectUrl: string;
        cancelRedirectUrl: string;
        successRedirectUrl: string;
    };
};

export type SSLCommerzVerifiedPayload = {
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

export type CustomerOrderPaymentGatewayPayload =
    | SSLCommerzInitiationPayload
    | SSLCommerzVerifiedPayload
    | Record<string, unknown>;

export type CustomerOrderPayment = {
    id: ApiId;
    businessId: ApiId;
    orderId: ApiId;
    financeAccountId: ApiId | null;
    gatewayId: ApiId | null;
    gatewayConfigId: ApiId | null;

    paymentNo: string;
    amount: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    transactionReference: string;

    gatewayTransactionId: string | null;
    gatewaySessionId: string | null;
    gatewayEventId: string | null;
    gatewayPayload: CustomerOrderPaymentGatewayPayload | null;

    paidAt: string | null;
    createdBy: ApiId | null;
    createdAt: string;
    updatedAt: string;
};

export type CustomerOrderStatusLog = {
    id: ApiId;
    orderId: ApiId;
    fromStatus: OrderStatus | null;
    toStatus: OrderStatus;
    note: string | null;
    changedBy: ApiId | null;
    createdAt: string;
};

export type CustomerOrderReturn = {
    id: ApiId;
    orderId?: ApiId;
    returnNo?: string;
    status?: string;
    amount?: string;
    reason?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CustomerOrderResponse = {
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

    shippingAddressSnapshot: CustomerOrderShippingAddressSnapshot;

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

    items: CustomerOrderItem[];
    payments: CustomerOrderPayment[];
    statusLogs: CustomerOrderStatusLog[];
    returns: CustomerOrderReturn[];
};

// cancel
export type CancelOrderPayload = {
    reason: string;
}

// return request
export type ReturnRequestItemPayload = {
    orderItemId: string;
    quantity: number;
    reason: string;
};

export type ReturnRequestPayload = {
    reason: string;
    items: ReturnRequestItemPayload[];
};

