export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US");
