"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";

type BreadcrumbProps = {
  basePath: string;
  labels: Record<string, string>;
  sliceIndex?: number;
};

export default function Breadcrumbs({
  basePath,
  labels,
  sliceIndex = 0,
}: BreadcrumbProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean).slice(sliceIndex);

  const items: any[] = [
    {
      title: (
        <Link href={basePath}>
          <HomeOutlined />
        </Link>
      ),
    },
    {
      title: <Link href={basePath}>{labels[""] || "Dashboard"}</Link>,
    },
  ];

  let currentPath = "";

  segments.forEach((seg) => {
    currentPath += `/${seg}`;
    const key = currentPath.slice(1);
    const fullPath = `${basePath}${currentPath}`;

    const label =
      labels[key] ||
      seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
