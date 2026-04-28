import { Layout } from "antd";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "antd/dist/reset.css";

import AuthProvider from "@/providers/auth-provider";
import AntdRegistry from "@/providers/antd-registry";
import QueryProvider from "@/providers/query-provider";
import AntdThemeProvider from "@/providers/antd-theme-provider";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdThemeProvider>
      <AntdRegistry>
        <Layout>{children}</Layout>
      </AntdRegistry>
    </AntdThemeProvider>
  );
}
