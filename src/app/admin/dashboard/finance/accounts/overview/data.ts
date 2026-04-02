import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export const mockStats = [
  {
    label: "Total Revenue",
    value: "$301,000",
    up: true,
    change: "+18.2% vs last period",
    icon: ArrowUpOutlined,
  },
  {
    label: "Total Expenses",
    value: "$180,000",
    up: false,
    change: "+5.1% vs last period",
    icon: ArrowDownOutlined,
  },
  {
    label: "Net Profit",
    value: "$121,000",
    up: true,
    change: "+32.4%",
    icon: DollarOutlined,
  },
  {
    label: "Profit Margin",
    value: "40.2%",
    up: true,
    change: "+2.3pp",
    icon: BarChartOutlined,
  },
];

export const mockMonthlyData = [
  { month: "Jan", revenue: 42000, expense: 28000 },
  { month: "Feb", revenue: 38000, expense: 25000 },
  { month: "Mar", revenue: 55000, expense: 32000 },
  { month: "Apr", revenue: 47000, expense: 29000 },
  { month: "May", revenue: 61000, expense: 35000 },
  { month: "Jun", revenue: 58000, expense: 31000 },
];

export const mockProfitData = mockMonthlyData.map((d) => ({
  ...d,
  profit: d.revenue - d.expense,
}));
