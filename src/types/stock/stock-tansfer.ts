export type StockTransferItem = {
  productId?: string;
  variantId?: string;
  requestedQuantity?: number;
};

export type StockTransferPayload = {
  fromWarehouseId?: string;
  toWarehouseId?: string;
  note?: string;
  items: StockTransferItem[];
};


export type StockTransferStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "SHIPPED"
  | "RECEIVED"
  | "CANCELLED";

export type StockTransferWarehouse = {
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

export type StockTransferItemResponse = {
  id: string;
  transferId: string;
  productId: string;
  variantId: string | null;
  requestedQuantity: string;
  transferredQuantity: string;
  receivedQuantity: string;
  createdAt: string;
  updatedAt: string;
};

export type StockTransferResponse = {
  id: string;
  businessId: string;
  transferNo: string;

  fromWarehouseId: string;
  toWarehouseId: string;

  fromWarehouse: StockTransferWarehouse;
  toWarehouse: StockTransferWarehouse;

  note: string | null;
  status: StockTransferStatus;

  approvedBy: string | null;
  shippedAt: string | null;
  receivedAt: string | null;

  createdBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  items: StockTransferItemResponse[];
};