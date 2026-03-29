import {
  UserOutlined,
  DatabaseOutlined,
  ShopOutlined,
  BarChartOutlined,
  MailOutlined,
} from "@ant-design/icons";

export const mockAddons = [
  {
    title: "Extra Users",
    desc: "Add more team members to your workspace.",
    price: "$5/user/mo",
    icon: <UserOutlined />,
  },
  {
    title: "Extra Storage",
    desc: "Additional 10 GB of cloud storage.",
    price: "$3/mo",
    icon: <DatabaseOutlined />,
    active: true,
  },
  {
    title: "Extra Warehouses",
    desc: "Add more warehouse locations.",
    price: "$10/warehouse/mo",
    icon: <ShopOutlined />,
  },
  {
    title: "Advanced Analytics",
    desc: "Unlock detailed reports and insights.",
    price: "$15/mo",
    icon: <BarChartOutlined />,
  },
  {
    title: "Email Marketing",
    desc: "Send promotional campaigns to customers.",
    price: "$20/mo",
    icon: <MailOutlined />,
  },
];
