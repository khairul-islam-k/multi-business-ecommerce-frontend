export type EntityStatus = "ACTIVE" | "INACTIVE";

export type StockItem = {
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

export type Product = {
  id: string;
  businessId: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string;
  price: string;
  weight: string;
  status: EntityStatus;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  productStocks: StockItem[];
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
  status: EntityStatus;
  createdBy: string;
  updatedBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Warehouse = {
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

export type WarehouseStock = {
  id: string;
  businessId: string;
  stockId: string;
  productId: string;
  variantId: string;
  warehouseId: string;
  stockItemKey: string;
  totalQuantity: string;
  quantityReserved: string;
  createdAt: string;
  updatedAt: string;
  warehouse: Warehouse;
};

export type InventoryStockResponse = {
  id: string;
  businessId: string;
  productId: string;
  variantId: string;
  stockItemKey: string;
  totalQuantity: string;
  quantityReserved: string;
  lowStockAlertQty: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
  variant: ProductVariant;
  warehouseStocks: WarehouseStock[];
};

export type LowStockAlertFormValues = {
  lowStockAlertQty: number;
};