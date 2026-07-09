import { headers } from "next/headers";

import FashionDashboard from "@/app/templates/fashion/pages/fashion-dashboard";
import { publicApi } from "@/lib/axios";

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
}
