"use client";

import { Layout, theme } from "antd";
import { ReactNode, useState } from "react";

import Sidebar from "./_components/sidebar";
import Topbar from "./_components/topbar";

const { Header, Content } = Layout;

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Layout
      hasSider
      style={{
        background: token.colorBgLayout,
        color: token.colorText,
        minHeight: "100vh",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Layout
        style={{
          background: token.colorBgLayout,
          marginLeft: mobileOpen ? 256 : 0,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          className="flex items-center"
          style={{
            background: token.colorBgContainer,
            borderLeft: `1px solid ${token.colorBorderSecondary}`,
            height: 64,
            lineHeight: "normal",
            padding: 0,
          }}
        >
          <Topbar
            collapsed={collapsed}
            onMobileMenuToggle={() => setMobileOpen(true)}
            onSidebarToggle={() => setCollapsed(!collapsed)}
          />
        </Header>

        <Content
          className="p-4 lg:p-8"
          style={{
            background: token.colorBgLayout,
            color: token.colorText,
            minHeight: "calc(100vh - 64px)",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
