"use client";

import { usePathname, useRouter } from "next/navigation";
import { theme, Layout, Menu, Drawer, MenuProps } from "antd";
import {
  DashboardOutlined,
  BankOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  BellOutlined,
  RadarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import Logo from "@/components/shared/logo";

const { Sider } = Layout;

const BASE_PATH = "/super-admin/dashboard";

const navItems: MenuProps["items"] = [
  {
    type: "group",
    label: "Overview",
    children: [
      { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
      { key: "/reports", icon: <BarChartOutlined />, label: "Reports" },
    ],
  },
  {
    type: "group",
    label: "Management",
    children: [
      { key: "/tenants", icon: <BankOutlined />, label: "Tenants" },
      { key: "/addons", icon: <ClusterOutlined />, label: "Addons" },
      { key: "/packages", icon: <AppstoreOutlined />, label: "Packages" },
    ],
  },
  {
    type: "group",
    label: "System",
    children: [
      { key: "/billing", icon: <CreditCardOutlined />, label: "Billing" },
      { key: "/notifications", icon: <BellOutlined />, label: "Notifications" },
      { key: "/monitoring", icon: <RadarChartOutlined />, label: "Monitoring" },
      { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    ],
  },
];

interface Props {
  mobileOpen: boolean;
  collapsed: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = theme.useToken();

  const activeKey =
    navItems
      ?.flatMap((group: any) => group.children || [])
      ?.find((item) => pathname.endsWith(`${BASE_PATH}${String(item?.key)}`))
      ?.key ?? "/";

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    router.push(`${BASE_PATH}${key}`);
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Logo Section */}
      <div
        className={`h-16 flex items-center transition-all duration-300 ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
        style={{
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: "rgba(0,0,0,0.02)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Logo collapsed={collapsed} />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[activeKey]}
        onClick={handleClick}
        className="border-r-0 flex-1 px-2 overflow-y-auto"
        items={navItems?.map((group: any) => ({
          ...group,
          children: group.children.map((item: any) => ({
            ...item,
            label: collapsed ? (
              <span title={item.label}>{item.label}</span>
            ) : (
              item.label
            ),
          })),
        }))}
      />
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <Sider
        width={240}
        collapsedWidth={65}
        collapsed={collapsed}
        trigger={null}
        className="hidden md:block"
        style={{
          background:
            token.colorBgContainer === "#141414"
              ? "linear-gradient(180deg, #141414 0%, #1f1f1f 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {sidebarContent}
      </Sider>

      {/* Mobile */}
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={onMobileClose}
        closeIcon={null}
        style={{ padding: 0 }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
