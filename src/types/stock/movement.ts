import { Product } from "./stock";

export type StockMovementType =
    | "PURCHASE_IN"
    | "PURCHASE_RETURN_OUT"
    | "SALE_OUT"
    | "SALE_RETURN_IN"
    | "ADJUSTMENT_IN"
    | "ADJUSTMENT_OUT"
    | "TRANSFER_IN"
    | "TRANSFER_OUT"
    | "RESERVED"
    | "RESERVATION_RELEASED"

export type StockReferenceType =
    | "PURCHASE_ORDER"
    | "SUPPLIER_INVOICE"
    | "PURCHASE_RETURN"
    | "ORDER"
    | "ORDER_RETURN"
    | "STOCK_ADJUSTMENT"
    | "STOCK_TRANSFER"
    | "MANUAL"

export type EntityStatus =
    | "ACTIVE"
    | "INACTIVE";

export type MovementStock = {
    id: string;
    businessId: string;
    productId: string;
    variantId: string | null;
    stockItemKey: string;
    totalQuantity: string;
    quantityReserved: string;
    lowStockAlertQty: string;
    createdAt: string;
    updatedAt: string;
};

export type MovementWarehouse = {
    id: string;
    businessId: string;
    name: string;
    address: string;
    phone: string;
    status: EntityStatus;
    createdBy: string;
    updatedBy: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type StockMovementResponse = {
    id: string;
    businessId: string;
    stockId: string;
    productId: string;
    product: Product;
    variantId: string | null;
    warehouseId: string;
    stockItemKey: string;
    movementType: StockMovementType;
    quantity: string;
    referenceId: string | null;
    referenceType: StockReferenceType | null;
    note: string | null;
    createdBy: string;
    createdAt: string;
    stock: MovementStock;
    warehouse: MovementWarehouse;
};