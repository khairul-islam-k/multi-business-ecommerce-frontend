import { CartProvider } from "@/app/store/_components/contex/CartContex";
import React from "react";
import ToastProviders from "./_components/message/toast-provider";
import { StoreThemeProvider } from "./_components/theme/store-theme-provider";
import { headers } from "next/headers";
import { publicApi } from "@/lib/axios";


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

  console.log(res.data.data.theme);

  // const backendTheme = {
  //    backgroundColor: 'red',
  //    textColor: 'white',
  //    primaryColor: 'yellow'
  // }

  return (
    <div>
      <CartProvider>

        <ToastProviders >
          <StoreThemeProvider backendTheme={res.data.data.theme}>
            {children}
          </StoreThemeProvider>
        </ToastProviders>
      </CartProvider>
    </div>
  );
};

export default WebsiteLayout;