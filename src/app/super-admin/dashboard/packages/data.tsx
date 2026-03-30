export const mockLimits = [
  {
    key: "max_products",
    label: "Max Products",
    values: { Starter: 100, Growth: 1000, Enterprise: 10000 },
  },
  {
    key: "Max Warehouses",
    label: "Max Warehouses",
    values: { Starter: 1, Growth: 5, Enterprise: 25 },
  },
  {
    key: "max_users",
    label: "Max Users",
    values: { Starter: 5, Growth: 25, Enterprise: 100 },
  },
  {
    key: "Max Orders/mo",
    label: "Max Orders/mo",
    values: { Starter: 500, Growth: 5000, Enterprise: 50000 },
  },
  {
    key: "Max Websites",
    label: "Max Websites",
    values: { Starter: 1, Growth: 3, Enterprise: 10 },
  },
];

export const mockPackages = [
  {
    id: "1",
    name: "Starter",
    slug: "starter",
    monthlyPrice: 49,
    yearlyPrice: 470,
    status: "Active",
    subscribers: 234,
    description: "For small businesses getting started",
  },
  {
    id: "2",
    name: "Growth",
    slug: "growth",
    monthlyPrice: 149,
    yearlyPrice: 1430,
    status: "Active",
    subscribers: 567,
    description: "For growing businesses",
  },
  {
    id: "3",
    name: "Enterprise",
    slug: "enterprise",
    monthlyPrice: 299,
    yearlyPrice: 2870,
    status: "Active",
    subscribers: 189,
    description: "For large organizations",
  },
];

export const mockModules = [
  { id: "1", name: "Inventory", description: "Product and stock management" },
  { id: "2", name: "Orders", description: "Order processing and fulfillment" },
  {
    id: "3",
    name: "Customers",
    description: "Customer relationship management",
  },
  { id: "4", name: "Finance", description: "Accounting and financial reports" },
  {
    id: "5",
    name: "Website Builder",
    description: "Create and manage websites",
  },
  { id: "6", name: "Marketing", description: "Campaigns and analytics" },
];
