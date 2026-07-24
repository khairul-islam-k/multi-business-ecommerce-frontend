import type { Metadata } from "next";
import "@/styles/global.css";

import { Open_Sans } from "next/font/google";

import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import { ShadcnThemeProvider } from "@/providers/shadcn-theme-provider";


const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "OneComm",
  description: "All in one ECommerce Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
    >
      <body className={openSans.className}>
        <ShadcnThemeProvider>
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </ShadcnThemeProvider>
      </body>
    </html>
  );
}
