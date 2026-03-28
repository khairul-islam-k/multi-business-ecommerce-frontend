"use client";

import { Layout } from "antd";
import { ReactNode } from "react";

const { Content } = Layout;

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="p-4 lg:p-8">{children}</Content>
    </Layout>
  );
}
