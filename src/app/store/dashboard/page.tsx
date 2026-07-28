import { headers } from "next/headers";

import FashionDashboard from "@/app/templates/fashion/pages/fashion-dashboard";
import { publicApi } from "@/lib/axios";
import ElectricDashboard from "@/app/templates/electronic/pages/electric-dashboard";

export default async function DashboardPage() {
  const header = await headers();

  const res = await publicApi.get("/storefront/resolve", {
    headers: {
      host: header.get("host") || "",
    },
  });

  if (res?.data?.data?.template === "FASHION") {
    return <FashionDashboard />;
  }

  if (res?.data?.data?.template === "ELECTRONIC") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "GROCERY") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "FURNITURE") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "PHARMACY") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "VEHICLE") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "COSMETICS") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "SHOES") {
    return <ElectricDashboard />;
  }

  if (res?.data?.data?.template === "TOY") {
    return <ElectricDashboard />;
  }
}
