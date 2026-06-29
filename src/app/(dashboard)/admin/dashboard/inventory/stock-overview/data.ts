import {
  Banknote,
  Inbox,
  LayoutDashboard,
  TriangleAlert
} from "lucide-react";

import { formatCurrency } from "./utils";

export const mockInventories = [
  {
    id: "inv-1",
    warehouse_name: "Main Warehouse",
    product_name: "Widget A",
    product_sku: "WA-001",
    variant_id: null,
    available_qty: 245,
    reserved_qty: 30,
    damaged_qty: 5,
    lost_qty: 2,
    avg_cost: 12.5,
  },
  {
    id: "inv-2",
    warehouse_name: "Main Warehouse",
    product_name: "Gadget B",
    product_sku: "GB-002",
    variant_id: null,
    available_qty: 89,
    reserved_qty: 12,
    damaged_qty: 0,
    lost_qty: 0,
    avg_cost: 45.0,
  },
  {
    id: "inv-3",
    warehouse_name: "East Distribution",
    product_name: "Part C",
    product_sku: "PC-003",
    variant_id: null,
    available_qty: 502,
    reserved_qty: 50,
    damaged_qty: 8,
    lost_qty: 1,
    avg_cost: 8.75,
  },
  {
    id: "inv-4",
    warehouse_name: "Main Warehouse",
    product_name: "Module D",
    product_sku: "MD-004",
    variant_id: null,
    available_qty: 15,
    reserved_qty: 5,
    damaged_qty: 2,
    lost_qty: 0,
    avg_cost: 120.0,
  },
  {
    id: "inv-5",
    warehouse_name: "West Coast Hub",
    product_name: "Sensor E",
    product_sku: "SE-005",
    variant_id: null,
    available_qty: 320,
    reserved_qty: 0,
    damaged_qty: 0,
    lost_qty: 3,
    avg_cost: 22.3,
  },
  {
    id: "inv-6",
    warehouse_name: "East Distribution",
    product_name: "Cable F",
    product_sku: "CF-006",
    variant_id: null,
    available_qty: 1050,
    reserved_qty: 200,
    damaged_qty: 12,
    lost_qty: 0,
    avg_cost: 3.2,
  },
  {
    id: "inv-7",
    warehouse_name: "West Coast Hub",
    product_name: "Board G",
    product_sku: "BG-007",
    variant_id: null,
    available_qty: 7,
    reserved_qty: 3,
    damaged_qty: 1,
    lost_qty: 0,
    avg_cost: 85.0,
  },
  {
    id: "inv-8",
    warehouse_name: "Main Warehouse",
    product_name: "Housing H",
    product_sku: "HH-008",
    variant_id: null,
    available_qty: 42,
    reserved_qty: 10,
    damaged_qty: 0,
    lost_qty: 1,
    avg_cost: 55.0,
  },
];

export const mockStats = [
  {
    label: "Total Products",
    value: String(mockInventories.length),
    up: true,
    change: "+0%",
    icon: LayoutDashboard,
  },
  {
    label: "Total Available",
    value: mockInventories
      .reduce((s, i) => s + i.available_qty, 0)
      .toLocaleString(),
    up: true,
    change: "+0%",
    icon: Inbox,
  },
  {
    label: "Total Reserved",
    value: mockInventories
      .reduce((s, i) => s + i.reserved_qty, 0)
      .toLocaleString(),
    up: false,
    change: "-0%",
    icon: TriangleAlert,
  },
  {
    label: "Inventory Value",
    value: formatCurrency(
      mockInventories.reduce((s, i) => s + i.available_qty * i.avg_cost, 0),
    ),
    up: true,
    change: "+0%",
    icon: Banknote,
  },
];
