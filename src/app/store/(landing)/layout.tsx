import { ElectronicFooter } from "@/app/templates/electronic/_components/footer";
import FashionFooter from "@/app/templates/fashion/_components/fashion-footer";
import FashionNavbar from "@/app/templates/fashion/_components/navbar";
import React from "react";
import { headers } from "next/headers";
import { publicApi } from "@/lib/axios";
import ElectronicNavbar from "@/app/templates/electronic/_components/navbar";
import GroceryNavbar from "@/app/templates/grocery/_components/grocery-navbar";
import FurnitureNavbar from "@/app/templates/furniture/_components/furniture-navbar";
import FurnitureFooter from "@/app/templates/furniture/_components/furniture-footer";
import PharmacyNavbar from "@/app/templates/pharmacy/_components/pharmacy-navbar";
import PharmacyFooter from "@/app/templates/pharmacy/_components/pharmacy-footer";
import VehicleNavbar from "@/app/templates/vehicle/_components/vehicle-navbar";
import VehicleFooter from "@/app/templates/vehicle/_components/vehicle-footer";
import CosmeticsNavbar from "@/app/templates/cosmetics/_components/cosmetics-navbar";
import CosmeticsFooter from "@/app/templates/cosmetics/_components/cosmetics-footer";

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


  const generalConfig = res.data.data.config?.generalConfig;


  const isFashion = res?.data?.data?.template === "FASHION";
  const isElectronic = res?.data?.data?.template === "ELECTRONIC";
  const isGrocery = res?.data?.data?.template === "GROCERY";
  const isFurniture = res?.data?.data?.template === "FURNITURE";
  const isPharmacy = res?.data?.data?.template === "PHARMACY";
  const isVehicle = res?.data?.data?.template === "VEHICLE";
  const isCosmetics = res?.data?.data?.template === "COSMETICS";

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

      {isPharmacy ? <PharmacyNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
        phone={phone}
      /> : null}

      {isVehicle ? <VehicleNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
        phone={phone}
      /> : null}

      {isCosmetics ? <CosmeticsNavbar
        faqs={faqs}
        terms={terms}
        privacy={privacy}
      /> : null}

      {children}

      {isElectronic ? <ElectronicFooter /> : null}
      {isFashion ? <FashionFooter
      generalConfig={generalConfig}
      footer={res?.data?.data?.config?.footerConfig} /> : null}

      {isGrocery ? <FashionFooter
      generalConfig={generalConfig}
      footer={res?.data?.data?.config?.footerConfig} /> : null}


      {isFurniture ? <FurnitureFooter
      generalConfig={generalConfig}
      footer={res?.data?.data?.config?.footerConfig} /> : null}

      {isPharmacy ? <PharmacyFooter
      generalConfig={generalConfig}
      footer={res?.data?.data?.config?.footerConfig} /> : null}

      {isVehicle ? <VehicleFooter
      generalConfig={generalConfig}
      footer={res?.data?.data?.config?.footerConfig} /> : null}

      {isCosmetics ? <CosmeticsFooter
      generalConfig={generalConfig}
      footer={res?.data?.data?.config?.footerConfig} /> : null}

    </div>
  );
};

export default WebsiteLayout;