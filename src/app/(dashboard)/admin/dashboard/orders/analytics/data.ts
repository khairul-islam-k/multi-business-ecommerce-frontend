import {
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export const mockStats = [
  {
    label: "Total Orders",
    value: "345",
    up: true,
    change: "12.5",
    icon: ShoppingCartOutlined,
  },
  {
    label: "Total Revenue",
    value: "3456",
    up: true,
    change: "8.2",
    icon: DollarOutlined,
  },
  {
    label: "Avg Order Value",
    value: "45",
    up: false,
    change: "-2.1",
    icon: BarChartOutlined,
  },
  {
    label: "Items Sold",
    value: "345",
    up: true,
    change: "5.7",
    icon: AppstoreOutlined,
  },
];

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

function randomDateLastDays(days: number) {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - days);

  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
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
    created_at: randomDateLastDays(7),
    items,
  };
});
