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
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Layout>
        <Header
          className="flex items-center"
          style={{ background: token.colorBgBase, paddingInline: 12 }}
        >
          <Topbar onMobileMenuToggle={() => setMobileOpen(true)} />
        </Header>

        <Content className="p-4 lg:p-8">{children}</Content>
      </Layout>
    </Layout>
  );
}
