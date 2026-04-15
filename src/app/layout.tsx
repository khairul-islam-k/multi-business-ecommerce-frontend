import { Layout } from "antd";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "@/styles/global.css";
import "antd/dist/reset.css";

import AntdRegistry from "@/providers/antd-registry";
import ThemeProvider from "@/providers/theme-provider";
import AuthProvider from "@/providers/auth-provider";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneComm",
  description: "All in one ECommerce ERP Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable}`}>
      <body>
        <ThemeProvider>
          <AntdRegistry>
            <AuthProvider>
              <Layout>{children}</Layout>
            </AuthProvider>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
