import { mockProducts, mockWarehouses } from "./data";

export const getProduct = (id: string) => mockProducts.find((p) => p.id === id);

export const getWarehouse = (id: string) =>
  mockWarehouses.find((w) => w.id === id);

export const formatCurrency = (v: number | null) =>
  v != null ? `$${v.toFixed(2)}` : "—";
