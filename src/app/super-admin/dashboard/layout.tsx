"use client";

import { ReactNode, use, useState } from "react";
import { theme, Layout } from "antd";

import Topbar from "./_components/topbar";
import Sidebar from "./_components/sidebar";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/providers/auth-provider";

const { Header, Content } = Layout;

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const { loading, user } = use(AuthContext);
  const router = useRouter();

  if (loading) return <h1>Loading...</h1>;

  if (!user) {
    return router.push("/super-admin/sign-in");
  }

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
