import type { Metadata } from "next";
import { Open_Sans, Geist } from "next/font/google";

import "@/styles/global.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
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
      className={cn(openSans.variable, "font-sans", geist.variable)}
    >
      <body>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
