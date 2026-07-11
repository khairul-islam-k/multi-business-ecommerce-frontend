import { ListQuery } from "@/lib/api";
export type AdjustmentType = "INCREASE" | "DECREASE";

export type StockAdjustmentItem = {
  productId?: string;
  variantId?: string;
  adjustmentQty?: number;
  reason?: string;
};

export type StockAdjustmentPayload = {
  warehouseId?: string;
  adjustmentType: AdjustmentType;
  reason?: string;
  items: StockAdjustmentItem[];
};

export type StockAdjustmentStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

type AdjustmentItem = {
  id: string;
  adjustmentId: string;
  productId: string;
  variantId: string | null;
  adjustmentQty: string;
  oldQuantity: string;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StockAdjustmentWarehouse = {
  id: string;
  businessId: string;
  name: string;
  address: string | null;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StockAdjustmentResponse = {
  id: string;
  businessId: string;
  warehouseId: string;
  adjustmentNo: string;
  adjustmentType: AdjustmentType;
  reason: string | null;
  status: StockAdjustmentStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  createdBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  warehouse: StockAdjustmentWarehouse;
  items: AdjustmentItem[];
};

export type AdjustmentQuery = ListQuery & {
  warehouseId?: string;
}