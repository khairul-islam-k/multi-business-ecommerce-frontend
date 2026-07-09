export const mockWarehouses = [
  { id: "w1", name: "Main Distribution Center" },
  { id: "w2", name: "Dhaka Retail Hub" },
  { id: "w3", name: "Chattogram Warehouse" },
  { id: "w4", name: "Returns & Damages Unit" },
];

export const mockProducts = [
  { id: "p1", name: "Wireless Mouse Logitech M185", sku: "LOG-M185-BLK" },
  { id: "p2", name: "Mechanical Keyboard Red Switch RK61", sku: "RK-RK61-RD" },
  { id: "p3", name: "USB-C Fast Charger 30W Anker", sku: "ANK-30W-CHR" },
  { id: "p4", name: '27" IPS Monitor Samsung', sku: "SAM-27IPS-FHD" },
  { id: "p5", name: "Laptop Stand Aluminum Adjustable", sku: "LST-ALU-ADJ" },
  {
    id: "p6",
    name: "Bluetooth Headphones Sony WH-CH520",
    sku: "SONY-CH520-BLK",
  },
  { id: "p7", name: "External SSD 1TB Samsung T7", sku: "SAM-T7-1TB" },
];

export const mockTransfers = [
  {
    id: "st1",
    transfer_no: "TR-001",
    from_warehouse_name: "Main Warehouse",
    to_warehouse_name: "East Hub",
    status: "pending",
    total_items: 2,
    created_at: "2026-03-31",
  },
  {
    id: "st2",
    transfer_no: "TR-002",
    from_warehouse_name: "East Hub",
    to_warehouse_name: "West Hub",
    status: "approved",
    total_items: 1,
    created_at: "2026-03-30",
  },
];
