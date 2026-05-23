"use client";

import React, { useState } from "react";
import { Layout, Drawer, theme, Grid } from "antd";

import Sidebar from "./_components/sidebar";
import TopBar from "./_components/top-bar";

const { Header, Sider, Content } = Layout;

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const screens = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();

  return (
      <Layout hasSider style={{ maxHeight: "100vh", overflow: "hidden" }}>
        {/* Desktop Sidebar */}
        {!screens.xs && (
          <Sider
            width={260}
            collapsed={collapsed}
            breakpoint="md"
            // collapsedWidth="0"
            trigger={null}
            style={{ background: token.colorBgContainer }}
          >
            <Sidebar collapsed={collapsed} />
          </Sider>
        )}

        {/* Mobile Sidebar */}
        <Drawer
          placement="left"
          open={open}
          onClose={() => setOpen(false)}
          size={260} // instead of width
          styles={{
            body: { padding: 0 }, // instead of bodyStyle
            // header: { display: "none" }, // instead of headerStyle
          }}
        >
          <Sidebar close={() => setOpen(false)} />
        </Drawer>

        {/* Right Side (Header + Content) */}
        <Layout>
          {/* Mobile Topbar */}
          <Header
            style={{
              padding: 0,
              background: token.colorBgContainer,
              display: "flex",
              alignItems: "center",
              borderLeft: `1px solid ${token.colorBorderSecondary}`,
              height: 64,
              lineHeight: "normal",
            }}
          >
            <TopBar
              collapsed={collapsed}
              toggleSidebar={() => setCollapsed(!collapsed)}
              toggle={() => setOpen(true)}
            />
          </Header>

          {/* Page Content */}
          <Content
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              padding: screens.xs ? "10px" : "24px",
              background: token.colorBgLayout,
            }}
          >
            {children}
          </Content>
        </Layout>

        {/* Desktop-only header visibility */}
        <style jsx>{`
          @media (min-width: 768px) {
            .desktop-header {
              display: block;
            }
          }
        `}</style>
      </Layout>
  );
}
