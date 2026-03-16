"use client";

import { useState } from "react";
import { theme, Layout, Menu, Drawer, MenuProps, Button } from "antd";
import { usePathname, useRouter } from "next/navigation";

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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import Logo from "@/components/shared/logo";

const { Sider } = Layout;

const BASE_PATH = "/super-admin/dashboard";

const navItems: MenuProps["items"] = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/tenants",
    icon: <BankOutlined />,
    label: "Tenants",
  },
  {
    key: "/packages",
    icon: <AppstoreOutlined />,
    label: "Packages",
  },
  {
    key: "/addons",
    icon: <ClusterOutlined />,
    label: "Addons",
  },
  {
    key: "/billing",
    icon: <CreditCardOutlined />,
    label: "Billing",
  },
  {
    key: "/reports",
    icon: <BarChartOutlined />,
    label: "Reports",
  },
  {
    key: "/notifications",
    icon: <BellOutlined />,
    label: "Notifications",
  },
  {
    key: "/monitoring",
    icon: <RadarChartOutlined />,
    label: "Monitoring",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

interface Props {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);

  const activeKey =
    navItems
      ?.find((item) => pathname.endsWith(`${BASE_PATH}${String(item?.key)}`))
      ?.key?.toString() ?? "/";

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    router.push(`${BASE_PATH}${key}`);
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-screen">
      {/* Logo + Toggle */}
      <div
        className={`h-16 flex items-center border-b border-black/10 ${
          collapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {!collapsed && <Logo />}

        <div className="hidden md:block">
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </div>
      </div>

      {/* Navigation */}
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[activeKey]}
        items={navItems}
        onClick={handleClick}
        className="border-r-0 flex-1"
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        width={240}
        collapsedWidth={65}
        collapsed={collapsed}
        trigger={null}
        className="hidden md:block"
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {sidebarContent}
      </Sider>

      {/* Mobile Sidebar */}
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={onMobileClose}
        closeIcon={null}
        styles={{ body: { padding: 0 } }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
