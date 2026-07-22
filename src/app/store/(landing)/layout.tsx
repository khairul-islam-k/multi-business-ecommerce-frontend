import { ElectronicFooter } from "@/app/templates/electronic/_components/footer";
import FashionFooter from "@/app/templates/fashion/_components/fashion-footer";
import FashionNavbar from "@/app/templates/fashion/_components/navbar";
import React from "react";
import { headers } from "next/headers";
import { publicApi } from "@/lib/axios";
import ElectronicNavbar from "@/app/templates/electronic/_components/navbar";
import GroceryNavbar from "@/app/templates/grocery/_components/grocery-navbar";
import FurnitureNavbar from "@/app/templates/furniture/_components/furniture-navbar";

const WebsiteLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const header = await headers()

  const res = await publicApi.get('/storefront/resolve', {
    headers: {
      host: header.get('host') || ""
    }
  })


  const faqs = res.data.data.config?.generalConfig?.faqs;
  const terms = res.data.data.config?.generalConfig?.extraPage?.termsAndConditions;
  const privacy = res.data.data.config?.generalConfig?.extraPage?.about;
  const phone = res.data.data.config?.footerConfig?.phone;

  console.log('phone', res.data.data.config?.footerConfig?.phone);


  const isFashion = res?.data?.data?.template === "FASHION";
  const isElectronic = res?.data?.data?.template === "ELECTRONIC";
  const isGrocery = res?.data?.data?.template === "GROCERY";
  const isFurniture = res?.data?.data?.template === "FURNITURE";

  return (
    <div>

      {isElectronic ? <ElectronicNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
      /> : null}

      {isFashion ? <FashionNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
      /> : null}

      {isGrocery ? <GroceryNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
        phone={phone}
      /> : null}

      {isFurniture ? <FurnitureNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
        phone={phone}
      /> : null}

      {children}

      {isElectronic ? <ElectronicFooter /> : null}
      {isFashion ? <FashionFooter footer={res?.data?.data?.config?.footerConfig} /> : null}

      {isGrocery ? <FashionFooter footer={res?.data?.data?.config?.footerConfig} /> : null}
    </div>
  );
};

export default WebsiteLayout;