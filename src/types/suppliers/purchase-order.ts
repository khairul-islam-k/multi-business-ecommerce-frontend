import { ApiId } from "@/lib/api";
import { SupplierResponse } from "./supplier";
import { TaxResponse } from "../finance/tax";
import { WarehouseResponse } from "../product/warehouse";
import { Product } from "../stock/stock";

export type PurchaseOrderStatus =
  | "DRAFT"
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export type PurchaseOrderItemPayload = {
  productId: string;
  variantId: string;
  quantityOrdered: number;
  unitCost: number;
  discountAmount: number;
};


export type PurchaseOrderPayload = {
  supplierId: string;
  warehouseId: string;
  taxId: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  shippingCost: number;
  note: string;
  items: PurchaseOrderItemPayload[]
};

export type PurchaseOrderResponse = {
  id: string;
  businessId: string;
  supplierId: string;
  warehouseId: string;
  taxId: string;
  purchaseOrderNo: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  subtotal: string;
  discountTotal: string;
  taxRate: string;
  taxTotal: string;
  shippingCost: string;
  totalAmount: string;
  note: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  supplier?: SupplierResponse;
  tax?: TaxResponse;
  warehouse?: WarehouseResponse;
  items: PurchaseOrderItemResponse[];
  invoices: unknown[];
};

export type ProductVariant = {
  id: string;
  businessId: string;
  productId: string;
  title: string;
  sku: string;
  barcode: string;
  priceOverride: string;
  weight: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
};

export type PurchaseOrderItemResponse = {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant | null;
  quantityOrdered: string;
  quantityReceived: string;
  unitCost: string;
  discountAmount: string;
  taxAmount: string;
  lineTotal: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdatePurchaseOrderPayload = {
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  shippingCost: number;
  note: string;
};

export type Note = {
  note: string;
}

// return
export type PurchaseReturnItemPayload = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  reason: string;
};

export type PurchaseReturnPayload = {
  reason: string;
  items: PurchaseReturnItemPayload[];
};