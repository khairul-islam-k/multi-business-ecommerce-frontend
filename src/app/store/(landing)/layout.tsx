import { ElectronicFooter } from "@/app/templates/electronic/_components/footer";
import FashionFooter from "@/app/templates/fashion/_components/fashion-footer";
import FashionNavbar from "@/app/templates/fashion/_components/navbar";
import React from "react";
import { headers } from "next/headers";
import { publicApi } from "@/lib/axios";
import ElectronicNavbar from "@/app/templates/electronic/_components/navbar";

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
        {isElectronic ? <ElectronicNavbar /> : null}
        {isFashion ? <FashionNavbar /> : null}

          {children}

        {isElectronic ? <ElectronicFooter /> : null}
        {isFashion ? <FashionFooter footer={res?.data?.data?.config?.footerConfig} /> : null}
    </div>
  );
};

export default WebsiteLayout;