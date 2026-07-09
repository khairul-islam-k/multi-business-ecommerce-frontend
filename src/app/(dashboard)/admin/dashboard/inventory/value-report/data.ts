// Mock data for Inventory module

export const mockWarehouses = [
  { id: "wh-1", name: "Main Warehouse", location: "New York" },
  { id: "wh-2", name: "East Distribution", location: "Boston" },
  { id: "wh-3", name: "West Coast Hub", location: "Los Angeles" },
];

export const mockProducts = [
  { id: "p-1", name: "Widget A", sku: "WA-001", category: "Components" },
  { id: "p-2", name: "Gadget B", sku: "GB-002", category: "Electronics" },
  { id: "p-3", name: "Part C", sku: "PC-003", category: "Components" },
  { id: "p-4", name: "Module D", sku: "MD-004", category: "Assemblies" },
  { id: "p-5", name: "Sensor E", sku: "SE-005", category: "Electronics" },
  { id: "p-6", name: "Cable F", sku: "CF-006", category: "Accessories" },
  { id: "p-7", name: "Board G", sku: "BG-007", category: "Electronics" },
  { id: "p-8", name: "Housing H", sku: "HH-008", category: "Assemblies" },
];

export const mockInventories = [
  {
    id: "inv-1",
    warehouse_id: "wh-1",
    product_id: "p-1",
    variant_id: null,
    available_qty: 245,
    reserved_qty: 30,
    damaged_qty: 5,
    lost_qty: 2,
    avg_cost: 12.5,
  },
  {
    id: "inv-2",
    warehouse_id: "wh-1",
    product_id: "p-2",
    variant_id: null,
    available_qty: 89,
    reserved_qty: 12,
    damaged_qty: 0,
    lost_qty: 0,
    avg_cost: 45.0,
  },
  {
    id: "inv-3",
    warehouse_id: "wh-2",
    product_id: "p-3",
    variant_id: null,
    available_qty: 502,
    reserved_qty: 50,
    damaged_qty: 8,
    lost_qty: 1,
    avg_cost: 8.75,
  },
  {
    id: "inv-4",
    warehouse_id: "wh-1",
    product_id: "p-4",
    variant_id: null,
    available_qty: 15,
    reserved_qty: 5,
    damaged_qty: 2,
    lost_qty: 0,
    avg_cost: 120.0,
  },
  {
    id: "inv-5",
    warehouse_id: "wh-3",
    product_id: "p-5",
    variant_id: null,
    available_qty: 320,
    reserved_qty: 0,
    damaged_qty: 0,
    lost_qty: 3,
    avg_cost: 22.3,
  },
  {
    id: "inv-6",
    warehouse_id: "wh-2",
    product_id: "p-6",
    variant_id: null,
    available_qty: 1050,
    reserved_qty: 200,
    damaged_qty: 12,
    lost_qty: 0,
    avg_cost: 3.2,
  },
  {
    id: "inv-7",
    warehouse_id: "wh-3",
    product_id: "p-7",
    variant_id: null,
    available_qty: 7,
    reserved_qty: 3,
    damaged_qty: 1,
    lost_qty: 0,
    avg_cost: 85.0,
  },
  {
    id: "inv-8",
    warehouse_id: "wh-1",
    product_id: "p-8",
    variant_id: null,
    available_qty: 42,
    reserved_qty: 10,
    damaged_qty: 0,
    lost_qty: 1,
    avg_cost: 55.0,
  },
];

// Helpers
export function getProduct(id: string) {
  return mockProducts.find((p) => p.id === id);
}

export function getWarehouse(id: string) {
  return mockWarehouses.find((w) => w.id === id);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
