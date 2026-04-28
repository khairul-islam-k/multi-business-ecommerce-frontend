import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "@/styles/global.css";

import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";

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
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
