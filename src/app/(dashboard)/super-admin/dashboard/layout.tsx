"use client";

import { theme, Layout } from "antd";
import { ReactNode, useState } from "react";

import Topbar from "./_components/topbar";
import Sidebar from "./_components/sidebar";
import AuthGuard from "@/components/auth/auth-guard";

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
    <AuthGuard redirectUrl="/super-admin/sign-in" role="Admin">
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
    </AuthGuard>
  );
}
