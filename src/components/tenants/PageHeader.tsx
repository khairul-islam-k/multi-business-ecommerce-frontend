"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, Typography, Space, Flex } from "antd";
import { ChevronRight } from "lucide-react";

const { Title, Text } = Typography;

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
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isTenantDetail =
    segments[0] === "tenants" &&
    segments.length === 2 &&
    segments[1] !== "create";

  const items: {
    title: ReactNode;
  }[] = [
    {
      title: <Link href="/">Home</Link>,
    },
  ];

  if (isTenantDetail) {
    items.push(
      {
        title: <Link href="/tenants">Tenants</Link>,
      },
      {
        title: "Tenant Details",
      }
    );
  } else {
    let currentPath = "";
    segments.forEach((seg, index) => {
      currentPath += `/${seg}`;
      const key = currentPath.slice(1);
      const label = routeLabels[key] || seg;

      items.push({
        title:
          index === segments.length - 1 ? (
            <Text strong>{label}</Text>
          ) : (
            <Link href={currentPath}>{label}</Link>
          ),
      });
    });
  }

  return (
    <Breadcrumb
      separator={<ChevronRight className="h-3.5 w-3.5" />}
      items={items}
    />
  );
}

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <Flex vertical gap={8}>
      <Flex
        justify="space-between"
        align="center"
        wrap
      >
        <Space direction="vertical" size={1}>
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
          <Breadcrumbs />
        </Space>

        {children && <Space>{children}</Space>}
      </Flex>
    </Flex>
  );
}