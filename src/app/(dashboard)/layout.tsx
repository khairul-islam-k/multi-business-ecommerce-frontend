import { Layout } from "antd";

import "antd/dist/reset.css";

import AntdRegistry from "@/providers/antd-registry";
import AntdThemeProvider from "@/providers/antd-theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <AntdThemeProvider>
        <Layout>{children}</Layout>
      </AntdThemeProvider>
    </AntdRegistry>
  );
}
