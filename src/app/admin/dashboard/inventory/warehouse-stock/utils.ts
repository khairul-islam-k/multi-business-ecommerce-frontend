import { mockProducts, mockWarehouses } from "./data";

export function getProduct(id: string) {
  return mockProducts.find((p) => p.id === id);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
