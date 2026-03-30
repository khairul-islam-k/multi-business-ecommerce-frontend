"use client";

import React, { useState } from "react";
import { Layout, Drawer, theme } from "antd";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

const { Header, Sider, Content } = Layout;

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout hasSider style={{ maxHeight: "100vh", overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <Sider
        width={260}
        breakpoint="md"
        collapsedWidth="0"
        trigger={null}
        style={{ background: token.colorBgBase }}
      >
        <Sidebar />
      </Sider>

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
        <Header style={{
          padding: 0,
          background: token.colorBgBase,
          display: 'flex',
          alignItems: 'center',
          borderLeft: `1px solid ${token.colorBorder}`
        }}>
          <TopBar toggle={() => setOpen(true)} />
        </Header>


        {/* Page Content */}
        <Content style={{ overflowY: 'auto', overflowX: 'hidden', padding: '20px' }}>
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
