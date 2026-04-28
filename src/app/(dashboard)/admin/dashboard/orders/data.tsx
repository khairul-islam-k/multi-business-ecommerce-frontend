export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export type NoteType = "internal" | "customer" | "system";

export type ReturnStatus =
  | "requested"
  | "approved"
  | "received"
  | "refunded"
  | "rejected";

const channels = [
  "Website",
  "Mobile App",
  "Marketplace",
  "Wholesale",
  "Social Media",
];

const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Latin America",
];

const couriers = ["FedEx", "DHL", "UPS", "USPS", "Royal Mail", null];

const suppliers = [
  "Warehouse A",
  "Warehouse B",
  "Drop Ship Co",
  "Local Supplier",
  null,
];

const statuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

export const mockProducts = [
  { id: "p-1", name: "Wireless Headphones Pro", sku: "WHP-001", price: 149.99 },
  { id: "P-2", name: "USB-C Hub Adapter", sku: "UCH-042", price: 59.99 },
  { id: "P-3", name: "Mechanical Keyboard", sku: "MKB-107", price: 189.99 },
  { id: "P-4", name: "Laptop Stand Aluminum", sku: "LSA-023", price: 79.99 },
  { id: "P-5", name: "Monitor Light Bar", sku: "MLB-015", price: 49.99 },
  { id: "P-6", name: "Ergonomic Mouse", sku: "ERM-088", price: 69.99 },
  { id: "P-7", name: "Webcam 4K", sku: "WC4-033", price: 129.99 },
  { id: "P-8", name: "Desk Mat XL", sku: "DMX-011", price: 34.99 },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOrderItems(orderId: string) {
  const count = Math.floor(Math.random() * 4) + 1;
  const picked = [...mockProducts]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  return picked.map((p, i) => {
    const qty = Math.floor(Math.random() * 3) + 1;
    const discount =
      Math.random() > 0.7 ? Math.round(p.price * 0.1 * 100) / 100 : 0;
    return {
      id: `oi-${orderId}-${i}`,
      order_id: orderId,
      product_id: `prod-${i}`,
      variant_id: Math.random() > 0.5 ? `var-${i}` : null,
      product_name_snapshot: p.name,
      sku_snapshot: p.sku,
      qty,
      unit_price: p.price,
      discount_amount: discount,
      total_price: Math.round((p.price * qty - discount) * 100) / 100,
    };
  });
}

export const mockOrders = Array.from({ length: 50 }, (_, i) => {
  const id = `ord-${String(i + 1).padStart(4, "0")}`;
  const items = generateOrderItems(id);
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    order_no: `#ord-${String(1000 + i)}`,
    customer_name: [
      "Alice Chen",
      "Bob Martinez",
      "Clara Johansson",
      "David Kim",
      "Emma Brown",
      "Frank Weber",
      "Grace Liu",
      "Hassan Ali",
      "Iris Nakamura",
      "James O'Brien",
    ][i % 10],
    customer_email: `customer${i}@example.com`,
    status: randomFrom(statuses),
    total: items.reduce((s, it) => s + it.total_price, 0),
    items_count: items.length,
    channel: randomFrom(channels),
    region: randomFrom(regions),
    courier: randomFrom(couriers),
    supplier: randomFrom(suppliers),
    created_at: date.toISOString(),
    items,
  };
});

export const mockNotes = mockOrders.slice(0, 20).flatMap((o, i) => [
  {
    id: `n-${o.id}-1`,
    order_id: o.id,
    note: "Customer requested expedited shipping.",
    note_type: "customer",
    created_by: "Support Agent",
    created_at: o.created_at,
  },
  {
    id: `n-${o.id}-2`,
    order_id: o.id,
    note: "Verified payment and stock availability.",
    note_type: "internal",
    created_by: "Admin",
    created_at: new Date(
      new Date(o.created_at).getTime() + 3600000,
    ).toISOString(),
  },
]);

export const mockStatusLogs = mockOrders.flatMap((o: any) => {
  const logs: any[] = [];
  const flow: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];
  const idx = flow.indexOf(o.status);
  const steps = idx >= 0 ? flow.slice(0, idx + 1) : [o.status];
  steps.forEach((s, i) => {
    const d = new Date(o.created_at);
    d.setHours(d.getHours() + i * 12);
    logs.push({
      id: `sl-${o.id}-${i}`,
      order_id: o.id,
      old_status: i === 0 ? null : steps[i - 1],
      new_status: s,
      note: `Order ${s}`,
      changed_by: "System",
      changed_at: d.toISOString(),
    });
  });
  return logs;
});

export const mockReturns = mockOrders
  .filter((o) => o.status === "returned")
  .map((o, i) => ({
    id: `ret-${i}`,
    order_id: o.id,
    return_no: `#RET-${1000 + i}`,
    reason: [
      "Defective product",
      "Wrong item received",
      "Changed mind",
      "Size doesn't fit",
    ][i % 4],
    condition: ["Unopened", "Used", "Damaged"][i % 3],
    refund_amount: Math.round(o.total * 0.9 * 100) / 100,
    status: (
      ["requested", "approved", "received", "refunded"] as ReturnStatus[]
    )[i % 4],
    received_at: i % 2 === 0 ? new Date().toISOString() : null,
  }));

export const mockPayments = mockOrders.map((o, i) => ({
  id: `pay-${i}`,
  order_id: o.id,
  payment_method: [
    "Credit Card",
    "PayPal",
    "Bank Transfer",
    "Apple Pay",
    "Google Pay",
  ][i % 5],
  transaction_ref:
    Math.random() > 0.3
      ? `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
      : null,
  amount: o.total,
  payment_status: (o.status === "cancelled"
    ? "refunded"
    : o.status === "returned"
      ? "refunded"
      : "paid") as PaymentStatus,
  paid_at: o.created_at,
}));
