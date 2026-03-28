"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  tenants: "Tenants",
  "tenants/create": "Create Tenant",
  packages: "Packages",
  "packages/create": "Create Package",
  addons: "Addons",
  "addons/create": "Create Addon",
  billing: "Billing",
  reports: "Reports",
  notifications: "Notifications",
  monitoring: "Monitoring",
  "monitoring/errors": "Error Monitoring",
  "monitoring/logs": "System Logs",
  settings: "Settings",
  editAddon: "EditAddon"
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const basePath = "/super-admin/dashboard";

  const segments = pathname.split("/").filter(Boolean).slice(2);

  const items: any[] = [
    {
      title: (
        <Link href={basePath}>
          <HomeOutlined />
        </Link>
      ),
    },
    { title: <Link href={basePath}>Dashboard</Link> },
  ];

  let currentPath = "";

  segments.forEach((seg) => {
    currentPath += `/${seg}`;
    const key = currentPath.slice(1);
    const fullPath = `${basePath}${currentPath}`;

    const label = routeLabels[key] || seg;

    items.push({
      title:
        fullPath === pathname ? label : <Link href={fullPath}>{label}</Link>,
    });
  });

  return (
    <div className="flex items-center h-6">
      <Breadcrumb
        items={items}
        separator={<RightOutlined />}
        className="m-0! p-0!"
      />
    </div>
  );
}
