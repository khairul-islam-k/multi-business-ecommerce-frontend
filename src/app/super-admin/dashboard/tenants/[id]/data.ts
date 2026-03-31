export const mockBillingHistory = [
  {
    id: "INV-2024-0892",
    amount: 299,
    tax: 29.9,
    total: 328.9,
    status: "Paid",
    paidDate: "2024-03-01",
  },
  {
    id: "INV-2024-0756",
    amount: 299,
    tax: 29.9,
    total: 328.9,
    status: "Paid",
    paidDate: "2024-02-01",
  },
  {
    id: "INV-2024-0621",
    amount: 149,
    tax: 14.9,
    total: 163.9,
    status: "Paid",
    paidDate: "2024-01-01",
  },
  {
    id: "INV-2024-0445",
    amount: 149,
    tax: 14.9,
    total: 163.9,
    status: "Failed",
    paidDate: null,
  },
  {
    id: "INV-2023-0312",
    amount: 49,
    tax: 4.9,
    total: 53.9,
    status: "Paid",
    paidDate: "2023-12-01",
  },
];

export const mockSystemLogs = [
  {
    id: "1",
    level: "error",
    service: "auth-service",
    message: "Failed login attempt from IP 192.168.1.45",
    timestamp: "2024-03-12 14:32:01",
  },
  {
    id: "2",
    level: "warning",
    service: "billing-service",
    message: "Payment retry scheduled for tenant #45",
    timestamp: "2024-03-12 14:28:15",
  },
  {
    id: "3",
    level: "info",
    service: "tenant-service",
    message: "Tenant 'LogiTrack' provisioned successfully",
    timestamp: "2024-03-12 14:25:00",
  },
  {
    id: "4",
    level: "error",
    service: "api-gateway",
    message: "Rate limit exceeded for tenant #23",
    timestamp: "2024-03-12 14:20:33",
  },
  {
    id: "5",
    level: "info",
    service: "backup-service",
    message: "Daily backup completed - 2.3GB",
    timestamp: "2024-03-12 14:00:00",
  },
  {
    id: "6",
    level: "warning",
    service: "storage-service",
    message: "Storage usage at 85% for tenant #12",
    timestamp: "2024-03-12 13:45:22",
  },
];

export const mockCompanyData = [
  {
    key: "1",
    company: "Main Store",
    websites: 1,
    users: 5,
  },
  {
    key: "2",
    company: "Warehouse Ops",
    websites: 2,
    users: 10,
  },
  {
    key: "3",
    company: "Online Division",
    websites: 3,
    users: 15,
  },
];

export const mockUsageData = [
  { name: "Products", used: 742, limit: 1000 },
  { name: "Orders/mo", used: 1890, limit: 5000 },
  { name: "Storage (GB)", used: 4.2, limit: 10 },
  { name: "API Calls", used: 48200, limit: 100000 },
  { name: "SMS Credits", used: 320, limit: 500 },
];

export const mockApiUsageByDay = [
  { day: "Mon", calls: 7200 },
  { day: "Tue", calls: 8100 },
  { day: "Wed", calls: 6800 },
  { day: "Thu", calls: 9200 },
  { day: "Fri", calls: 7600 },
  { day: "Sat", calls: 4200 },
  { day: "Sun", calls: 3100 },
];

export const mockFeatures: Record<
  string,
  { name: string; enabled: boolean }[]
> = {
  Orders: [
    { name: "Allow returns", enabled: true },
    { name: "Allow partial payment", enabled: true },
    { name: "Allow COD", enabled: false },
  ],
  "Website Builder": [
    { name: "Enable AI site generation", enabled: false },
    { name: "Enable custom domain", enabled: true },
  ],
};
