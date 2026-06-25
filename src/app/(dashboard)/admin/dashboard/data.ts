import {
  CircleDollarSign,
  LayoutDashboard,
  ShoppingCart,
  Users
} from "lucide-react";

export const mockStats = [
  {
    label: "Total Orders",
    value: "1,482",
    change: "+2.1%",
    up: true,
    icon: ShoppingCart,
  },
  {
    label: "Active Customers",
    value: "1,247",
    change: "+3.4%",
    up: true,
    icon: Users,
  },
  {
    label: "Total Products",
    value: "384",
    change: "+1.8%",
    up: true,
    icon: LayoutDashboard,
  },
  {
    label: "Total Revenue",
    value: "$128,430",
    change: "+5.2%",
    up: true,
    icon: CircleDollarSign,
  },
];

export const mockSalesOverview = [
  { month: "Jul", value: 78000 },
  { month: "Aug", value: 84500 },
  { month: "Sep", value: 81200 },
  { month: "Oct", value: 96500 },
  { month: "Nov", value: 112300 },
  { month: "Dec", value: 124800 },
  { month: "Jan", value: 109400 },
  { month: "Feb", value: 116750 },
];

export const mockCustomerGrowth = [
  { month: "Jul", value: 120 },
  { month: "Aug", value: 150 },
  { month: "Sep", value: 138 },
  { month: "Oct", value: 175 },
  { month: "Nov", value: 210 },
  { month: "Dec", value: 240 },
  { month: "Jan", value: 190 },
  { month: "Feb", value: 205 },
];

export const mockOrders = [
  {
    key: "1",
    orderId: "#ORD-1001",
    owner: "John Doe",
    product: "Wireless Headphones",
    amount: "$89.99",
    status: "Delivered",
  },
  {
    key: "2",
    orderId: "#ORD-1002",
    owner: "Sarah Khan",
    product: "Gaming Mouse",
    amount: "$39.50",
    status: "Processing",
  },
  {
    key: "3",
    orderId: "#ORD-1003",
    owner: "Michael Lee",
    product: '27" 4K Monitor',
    amount: "$329.00",
    status: "Delivered",
  },
  {
    key: "4",
    orderId: "#ORD-1004",
    owner: "Ayesha Rahman",
    product: "Mechanical Keyboard",
    amount: "$120.00",
    status: "Cancelled",
  },
  {
    key: "5",
    orderId: "#ORD-1005",
    owner: "David Smith",
    product: "USB-C Hub",
    amount: "$45.99",
    status: "Delivered",
  },
  {
    key: "6",
    orderId: "#ORD-1006",
    owner: "Nusrat Jahan",
    product: "External SSD 1TB",
    amount: "$110.00",
    status: "Processing",
  },
  {
    key: "7",
    orderId: "#ORD-1007",
    owner: "Tanvir Hasan",
    product: "Bluetooth Speaker",
    amount: "$75.25",
    status: "Delivered",
  },
  {
    key: "8",
    orderId: "#ORD-1008",
    owner: "Emily Clark",
    product: "Laptop Stand",
    amount: "$32.00",
    status: "Expired",
  },
];
