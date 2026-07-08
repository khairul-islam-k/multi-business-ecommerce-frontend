import { ListQuery, OrderSource, OrderStatus, OrderType } from "@/lib/api";
import { PaymentStatus } from "../template/template-payment";

export type ApiId = string;

export type CourierProviderCode = "REDX";

export type CourierMode = "LIVE" | "SANDBOX";

export type CourierStatus = "ACTIVE" | "INACTIVE";

export type CourierConfigData = Record<string, string>;

export type CourierProvider = {
  id: ApiId;
  name: string;
  code: CourierProviderCode;
  description: string;
  status: CourierStatus;
  createdAt: string;
  updatedAt: string;
};

export type CourierConfigResponse = {
  id: ApiId;
  businessId: ApiId;
  courierId: ApiId;

  configData: CourierConfigData;

  mode: CourierMode;
  status: CourierStatus;

  createdBy: ApiId | null;
  updatedBy: ApiId | null;
  deletedBy: ApiId | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  courier: CourierProvider;

  webhookConfigured: boolean;
  webhookUrlHint: string;
};

// update bulk
export type UpdateCourierConfigPayload = {
  configs: {
    configData: CourierConfigData;
    mode: CourierMode;
    status: CourierStatus;
    rotateWebhookToken: boolean;
    configId: ApiId;
  }[];
};

// Areas courier
export type CourierAreaResponse = {
  areas: {
    id: number;
    name: string;
    post_code: number;
    district_name: string;
    division_name: string;
    zone_id: number;
  }[]
};


// pick up store
export type PickupStore = {
  id: number;
  name: string;
  address: string;
  area_name: string;
  area_id: number;
  phone: string;
};

export type PickupStoresResponse = {
  pickup_stores: PickupStore[];
};


export type PickupStorePayload = {
  name: string;
  phone: string;
  address: string;
  areaId: string;
};

// template courier charge 

export type CourierDeliveryPayload = {
  deliveryAreaId: string;
  deliveryAreaName: string;
  deliveryPostCode: string;
  deliveryDivisionName: string;
  weight: number;
  specialInstruction?: string;
};

// charge calculate response template
export type CourierChargeCalculationResponse = {
  courierId: string;
  configId: string;
  weight: number;
  collectableAmount: number;
  shippingCharge: number;
  deliveryCharge: number;
  codCharge: number;
  courierFee: number;
  raw: {
    deliveryCharge: number;
    codCharge: number;
  };
  pickupWarehouse: {
    id: string;
    redxAreaId: string;
    redxAreaName: string;
    redxPostCode: string;
    redxPickupStoreId: string;
  };
  delivery: {
    areaId: string;
    areaName: string;
    postCode: string;
    divisionName: string;
  };
};

// courier shipment
export type ShipmentStatus =
  | "PENDING"
  | "BOOKED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED"
  | "CANCELLED";



export type DeliveryAddressSnapshot = {
  address: string;
  courierQuote?: {
    deliveryAreaId: string;
    deliveryAreaName: string;
    deliveryPostCode: string;
    deliveryDivisionName: string;
  };
};

export type ProviderRequest = {
  instruction: string | null;
  parcelWeight: number;
};

export type OrderShippingAddressSnapshot = {
  address: string;
};

export type ShipmentOrder = {
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
  shippingAddressSnapshot: OrderShippingAddressSnapshot;
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



export type PickupWarehouse = {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  address: string;
  redxAreaId: string;
  redxAreaName: string;
  redxPostCode: string;
  redxPickupStoreId: string;
  status: CourierStatus;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ShipmentOrderItem = {
  id: string;
  orderId: string;
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

export type ShipmentProduct = {
  id: string;
  businessId: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  taxId: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  barcode: string;
  price: string;
  weight: string;
  status: CourierStatus;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ShipmentVariant = {
  id: string;
  businessId: string;
  productId: string;
  sku: string;
  barcode: string;
  title: string;
  priceOverride: string;
  weight: string;
  status: CourierStatus;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ShipmentItem = {
  id: string;
  shipmentId: string;
  orderItemId: string;
  productId: string;
  variantId: string | null;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  orderItem: ShipmentOrderItem;
  product: ShipmentProduct;
  variant: ShipmentVariant | null;
};

export type ShipmentResponse = {
  id: string;
  businessId: string;
  orderId: string;
  courierId: string;
  courierConfigId: string;
  pickupWarehouseId: string;

  shipmentNo: string;
  consignmentId: string | null;
  trackingCode: string | null;
  providerStatus: string | null;
  status: ShipmentStatus;

  shippingCharge: string;
  codAmount: string;
  deliveryCharge: string;
  codCharge: string;
  courierFee: string;

  recipientName: string;
  recipientPhone: string;

  deliveryAreaId: string;
  deliveryAreaName: string;
  deliveryPostCode: string;
  deliveryDivisionName: string;

  pickupAreaId: string;
  pickupAreaName: string;
  pickupPostCode: string;
  pickupStoreId: string;

  deliveryAddressSnapshot: DeliveryAddressSnapshot;
  providerRequest: ProviderRequest;
  providerResponse: unknown | null;
  lastWebhookPayload: unknown | null;

  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  createdBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  order: ShipmentOrder;
  courier: CourierProvider;
  courierConfig: CourierConfigResponse;
  pickupWarehouse: PickupWarehouse;
  items: ShipmentItem[];
};

// shipment query

export type ShipmentQuery = ListQuery & {
  status?: ShipmentStatus;
  orderId?: string;
  courierId?: string;
}

// Tracking 

export type AddressType =
  |"HOME"
  |"OFFICE"
  |"SHIPPING"
  |"BILLING"
  |"OTHER";

export type CourierQuoteSnapshot = {
  deliveryAreaId: string;
  deliveryAreaName: string;
  deliveryPostCode: string;
  specialInstruction?: string;
  deliveryDivisionName: string;
};

export type ShipmentDeliveryAddressSnapshot = {
  city?: string;
  name?: string;
  address: string;
  country?: string;
  addressId?: string;
  addressType?: AddressType;
  courierQuote?: CourierQuoteSnapshot;
};

export type ShipmentProviderRequest = {
  instruction: string | null;
  isClosedBox?: boolean;
  parcelValue?: number;
  customerName?: string;
  parcelWeight: number;
  pickupAreaId?: string;
  customerPhone?: string;
  pickupStoreId?: string;
  deliveryAreaId?: string;
  pickupAreaName?: string;
  deliveryAddress?: string;
  deliveryAreaName?: string;
  merchantParcelId?: string;
  cashCollectionAmount?: number;
};

export type ShipmentTrackingItem = {
  time: string;
  message_bn: string;
  message_en: string;
};

export type ShipmentProviderResponse = {
  tracking: ShipmentTrackingItem[];
};

export type ShipmentWebhookPayload = {
  status: string;
  tracking_number: string;
};

export type ShipmentTrackingShipment = {
  id: string;
  businessId: string;
  orderId: string;
  courierId: string;
  courierConfigId: string;
  pickupWarehouseId: string;

  shipmentNo: string;
  consignmentId: string | null;
  trackingCode: string | null;
  providerStatus: string | null;
  status: ShipmentStatus;

  shippingCharge: string;
  codAmount: string;
  deliveryCharge: string;
  codCharge: string;
  courierFee: string;

  recipientName: string;
  recipientPhone: string;

  deliveryAreaId: string;
  deliveryAreaName: string;
  deliveryPostCode: string;
  deliveryDivisionName: string;

  pickupAreaId: string;
  pickupAreaName: string;
  pickupPostCode: string;
  pickupStoreId: string;

  deliveryAddressSnapshot: ShipmentDeliveryAddressSnapshot;
  providerRequest: ShipmentProviderRequest;
  providerResponse: ShipmentProviderResponse | null;
  lastWebhookPayload: ShipmentWebhookPayload | null;

  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  createdBy: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProviderTrackingResponse = {
  tracking: ShipmentTrackingItem[];
};

export type ShipmentTrackingResponse = {
  shipment: ShipmentTrackingShipment;
  providerTracking: ProviderTrackingResponse;
};

// courier assign payload
export type AssignToCourierPayload = {
    deliveryAreaId: string;
    deliveryAreaName: string;
    deliveryPostCode: string;
    deliveryDivisionName: string;
    specialInstruction?: string;
    courierConfigId: string;
};