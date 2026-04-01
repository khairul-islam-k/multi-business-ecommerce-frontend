"use client";

import { ReactNode, useState } from "react";
import { theme, Layout } from "antd";

import Topbar from "./_components/topbar";
import Sidebar from "./_components/sidebar";

const { Header, Content } = Layout;

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  console.log(collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Layout
        style={{
          marginLeft: mobileOpen ? 256 : 0,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          className="flex items-center"
          style={{ background: token.colorBgBase, paddingInline: 12 }}
        >
          <Topbar
            onMobileMenuToggle={() => setMobileOpen(true)}
            onSidebarToggle={() => setCollapsed(!collapsed)}
          />
        </Header>

        <Content className="p-4 lg:p-8">{children}</Content>
      </Layout>
    </Layout>
  );
}
