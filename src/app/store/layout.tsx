import { CartProvider } from "@/app/store/_components/contex/CartContex";
import React from "react";
import ToastProviders from "./_components/message/toast-provider";
import { StoreThemeProvider } from "./_components/theme/store-theme-provider";


const WebsiteLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const backendTheme = {
    // backgroundColor: 'red',
    // textColor: 'white',
    // primaryColor: 'yellow'
  }

  return (
    <div>
      <CartProvider>

        <ToastProviders >
          <StoreThemeProvider backendTheme={backendTheme}>
            {children}
          </StoreThemeProvider>
        </ToastProviders>
      </CartProvider>
    </div>
  );
};

export default WebsiteLayout;