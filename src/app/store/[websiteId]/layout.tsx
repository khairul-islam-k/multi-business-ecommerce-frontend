import { CartProvider } from "@/app/store/[websiteId]/_components/contex/CartContex";
import { ElectronicFooter } from "@/app/templates/electronic/_components/footer";
import { ElectronicNavBar } from "@/app/templates/electronic/_components/navbar";
import FashionFooter from "@/app/templates/fashion/_components/fashion-footer";
import FashionNavbar from "@/app/templates/fashion/_components/navbar";
import React from "react";

type WebsiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    websiteId: string;
  }>;
};

const WebsiteLayout = async ({ children, params }: WebsiteLayoutProps) => {
  const { websiteId } = await params;

  console.log('web', websiteId);

  

  const site = {
    id: websiteId,
    name: "Onecomm Store",
    templateName: "fashion",
    logo: "https://placehold.co/200x80/png?text=Onecomm+Store",
  };

  const isFashion = site.templateName === "fashion";
  const isElectronic = site.templateName === "electronic";

  return (
    <div>
      <CartProvider>
        {isElectronic ? <ElectronicNavBar site={site} /> : null}
        {isFashion ? <FashionNavbar site={site} /> : null}

        {children}

        {isElectronic ? <ElectronicFooter site={site} /> : null}
        {isFashion ? <FashionFooter site={site} /> : null}
      </CartProvider>
    </div>
  );
};

export default WebsiteLayout;