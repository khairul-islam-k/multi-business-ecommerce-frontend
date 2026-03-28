import {
  DollarOutlined,
  FileTextOutlined,
  RedoOutlined,
  RiseOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const mockStats = [
  { label: "Total Revenue", value: "$1,540,200", icon: DollarOutlined },
  { label: "MRR", value: "$128,430", icon: RiseOutlined },
  { label: "ARR", value: "$1,541,160", icon: FileTextOutlined },
  { label: "Outstanding", value: "$12,340", icon: WarningOutlined },
  { label: "Refunds", value: "$3,210", icon: RedoOutlined },
];

export const mockRevenueOverTime = [
  { month: "Jul", revenue: 98000 },
  { month: "Aug", revenue: 105000 },
  { month: "Sep", revenue: 112000 },
  { month: "Oct", revenue: 118000 },
  { month: "Nov", revenue: 124000 },
  { month: "Dec", revenue: 128000 },
  { month: "Jan", revenue: 132000 },
  { month: "Feb", revenue: 128430 },
];

export const mockRevenueByPackage = [
  { name: "Starter", value: 11466 },
  { name: "Growth", value: 84483 },
  { name: "Enterprise", value: 56511 },
];
