import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import { Layout } from "antd";
import "antd/dist/reset.css";

import "@/styles/global.css";
import ThemeProvider from "@/providers/theme-provider";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneComm",
  description: "All in one ECommerce ERP Solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body className={`${openSans.variable}`}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </ThemeProvider>
  );
}
