import { CartProvider } from "@/app/store/_components/contex/CartContex";
import React from "react";
import ToastProviders from "./_components/message/toast-provider";
import { StoreThemeProvider } from "./_components/theme/store-theme-provider";
import { headers } from "next/headers";
import { publicApi } from "@/lib/axios";
import TemplateFontProvider from "./_components/template-font-provider";


const WebsiteLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const header = await headers();

  const res = await publicApi.get("/storefront/resolve", {
    headers: {
      host: header.get("host") || "",
    },
  });

  const fontFamily = res.data.data.theme.fontFamily;


  return (
    <div>
      <TemplateFontProvider 
      fontFamily={fontFamily}
      >
        <CartProvider>
          <ToastProviders >
            <StoreThemeProvider
              sideBar={res.data.data.config.generalConfig.dashboardColors}
              backendTheme={res.data.data.theme}>
              {children}
            </StoreThemeProvider>
          </ToastProviders>
        </CartProvider>
      </TemplateFontProvider>
    </div>
  );
};

export default WebsiteLayout;