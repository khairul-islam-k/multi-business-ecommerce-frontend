"use client";

import Link from "next/link";
import { Breadcrumb, Dropdown } from "antd";
import { usePathname } from "next/navigation";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import type { BreadcrumbProps as AntdBreadcrumbProps } from "antd";

type BreadcrumbProps = {
  basePath: string;
  labels: Record<string, string>;
  sliceIndex?: number;
  maxItems?: number;
};

function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    str,
  );
}

function shortenUUID(uuid: string) {
  return `${uuid.slice(0, 8)}...${uuid.slice(-4)}`;
}

function formatLabel(seg: string, labels: Record<string, string>, key: string) {
  if (labels[key]) return labels[key];

  if (isUUID(seg)) return shortenUUID(seg);

  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({
  basePath,
  labels,
  sliceIndex = 0,
  maxItems = 5,
}: BreadcrumbProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean).slice(sliceIndex);

  let currentPath = "";

  const items: AntdBreadcrumbProps["items"] = [
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

  segments.forEach((seg) => {
    currentPath += `/${seg}`;
    const key = currentPath.slice(1);
    const fullPath = `${basePath}${currentPath}`;

    const label = formatLabel(seg, labels, key);

    items.push({
      title:
        pathname === fullPath ? label : <Link href={fullPath}>{label}</Link>,
    });
  });

  let finalItems = items;

  if (items.length > maxItems) {
    const hiddenItems = items.slice(2, items.length - (maxItems - 2));

    finalItems = [
      items[0],
      items[1],
      {
        title: (
          <Dropdown
            menu={{
              items: hiddenItems.map((item, index) => ({
                key: index.toString(),
                label: item?.title,
              })),
            }}
          >
            <span className="cursor-pointer">...</span>
          </Dropdown>
        ),
      },
      ...items.slice(items.length - (maxItems - 2)),
    ];
  }

  return (
    <div className="flex items-center h-6 overflow-hidden">
      <Breadcrumb
        items={finalItems}
        separator={<RightOutlined />}
        className="m-0! p-0!"
      />
    </div>
  );
}
