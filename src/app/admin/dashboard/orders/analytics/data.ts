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
