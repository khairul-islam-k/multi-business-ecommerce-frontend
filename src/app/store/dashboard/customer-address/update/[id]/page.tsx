import ElectronicUpdateCustomerAddress from "@/app/templates/electronic/pages/electronic-update-customer-address";
import FashionUpdateCustomerAddress from "@/app/templates/fashion/pages/fashion-update-customer-address";
import { publicApi } from "@/lib/axios";
import { headers } from "next/headers";
import React from "react";

type UpdateCustomerAddressProps = {
  params: Promise<{
    id: string;
  }>;
};

const UpdateCustomerAddress = async ({ params }: UpdateCustomerAddressProps) => {
  const { id } = await params;

  const header = await headers();

  const res = await publicApi.get("/storefront/resolve", {
    headers: {
      host: header.get("host") || "",
    },
  });

  if (res?.data?.data?.template === "FASHION") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "ELECTRONIC") {
    return <ElectronicUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "GROCERY") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "FURNITURE") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "PHARMACY") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "VEHICLE") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "COSMETICS") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "SHOES") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "TOY") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  if (res?.data?.data?.template === "RESTAURANT") {
    return <FashionUpdateCustomerAddress addressId={id} />;
  }

  return null;
};

export default UpdateCustomerAddress;