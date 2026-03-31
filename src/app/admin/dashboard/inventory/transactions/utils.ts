import { mockProducts, mockWarehouses } from "./data";

export const getProduct = (id: string) => mockProducts.find((p) => p.id === id);
export const getWarehouse = (id: string) =>
  mockWarehouses.find((w) => w.id === id);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US");
