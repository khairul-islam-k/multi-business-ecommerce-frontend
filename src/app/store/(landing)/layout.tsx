import { headers } from "next/headers";
import { ElectronicFooter } from "@/app/templates/electronic/_components/footer";
import { ElectronicNavBar } from "@/app/templates/electronic/_components/navbar";
import FashionFooter from "@/app/templates/fashion/_components/fashion-footer";
import FashionNavbar from "@/app/templates/fashion/_components/navbar";
import React from "react";
import { publicApi } from "@/lib/axios";


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


  const isFashion = res?.data?.data?.template === "FASHION";
  const isElectronic = res?.data?.data?.template === "ELECTRONIC";

  return (
    <div>
        {isElectronic ? <ElectronicNavBar /> : null}
        {isFashion ? <FashionNavbar /> : null}

          {children}

        {isElectronic ? <ElectronicFooter /> : null}
        {isFashion ? <FashionFooter /> : null}
    </div>
  );
};

export default WebsiteLayout;