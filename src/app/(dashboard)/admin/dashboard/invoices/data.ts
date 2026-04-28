import {
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

export const mockInvoices = [
  {
    id: "INV-001",
    invoiceNo: "INV-2024-001",
    customer: "Acme Corp",
    amount: "৳45,000",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "INV-001",
    invoiceNo: "INV-2024-001",
    customer: "Acme Corp",
    amount: "৳45,000",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "unpaid",
  },
  {
    id: "INV-001",
    invoiceNo: "INV-2024-001",
    customer: "Acme Corp",
    amount: "৳45,000",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "INV-001",
    invoiceNo: "INV-2024-001",
    customer: "Acme Corp",
    amount: "৳45,000",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
];

export const mockStats = [
  {
    label: "Total Invoices",
    value: "156",
    up: true,
    change: "+8.2%",
    icon: FileTextOutlined,
  },
  {
    label: "Revenue",
    value: "৳32L",
    up: true,
    change: "+12.5%",
    icon: DollarOutlined,
  },
  {
    label: "Pending",
    value: "23",
    up: false,
    change: "-3.1%",
    icon: ClockCircleOutlined,
  },
  {
    label: "Overdue",
    value: "5",
    up: false,
    change: "+1.4%",
    icon: WarningOutlined,
  },
];
