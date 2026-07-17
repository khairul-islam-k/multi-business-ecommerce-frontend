"use client";

import Link from "next/link";
import { Breadcrumb, Dropdown } from "antd";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
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

function formatLabel(
  seg: string,
  labels: Record<string, string>,
  key: string,
) {
  if (labels[key]) return labels[key];

  if (isUUID(seg)) return shortenUUID(seg);

  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const breadcrumbItemClass =
  "inline-flex h-6 max-w-36 items-center truncate leading-6";

export default function Breadcrumbs({
  basePath,
  labels,
  sliceIndex = 0,
  maxItems = 5,
}: BreadcrumbProps) {
  const pathname = usePathname();

  console.log("pathname", pathname, sliceIndex, maxItems);

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .slice(sliceIndex);

  console.log("segments", segments);

  let currentPath = "";

  const items: NonNullable<AntdBreadcrumbProps["items"]> = [
    {
      title: (
        <Link
          href={basePath}
          className="inline-flex h-6 items-center justify-center leading-none"
        >
          <Home
            size={20}
            strokeWidth={2}
            className="block shrink-0"
          />
        </Link>
      ),
    },
    {
      title: (
        <Link href={basePath} className={breadcrumbItemClass}>
          {labels[""] || "Dashboard"}
        </Link>
      ),
    },
  ];

  segments.forEach((seg, index) => {
    currentPath += `/${seg}`;

    const key = currentPath.slice(1);
    const fullPath = `${basePath}${currentPath}`;

    // Your existing redirect logic remains unchanged
    const redirectUrl = index === 0 ? "" : fullPath;

    const label = formatLabel(seg, labels, key);
    const isCurrentPage = pathname === fullPath;

    items.push({
      title: isCurrentPage ? (
        <span className={breadcrumbItemClass}>{label}</span>
      ) : (
        <Link href={redirectUrl} className={breadcrumbItemClass}>
          {label}
        </Link>
      ),
    });
  });

  let finalItems = items;

  if (items.length > maxItems) {
    const hiddenItems = items.slice(
      2,
      items.length - (maxItems - 2),
    );

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
            <span className="inline-flex h-6 cursor-pointer items-center leading-6">
              ...
            </span>
          </Dropdown>
        ),
      },
      ...items.slice(items.length - (maxItems - 2)),
    ];
  }

  return (
    <div className="flex min-h-6 w-full min-w-0 items-center overflow-hidden">
      <Breadcrumb
        items={finalItems}
        separator={
          <ChevronRight
            size={14}
            strokeWidth={2}
            className="block shrink-0"
          />
        }
        className="
          m-0! min-w-0 p-0!

          [&_ol]:flex
          [&_ol]:min-w-0
          [&_ol]:flex-nowrap
          [&_ol]:items-center

          [&_li]:inline-flex
          [&_li]:h-6
          [&_li]:shrink-0
          [&_li]:items-center
          [&_li]:leading-6

          [&_.ant-breadcrumb-link]:inline-flex
          [&_.ant-breadcrumb-link]:h-6
          [&_.ant-breadcrumb-link]:max-w-36
          [&_.ant-breadcrumb-link]:items-center
          [&_.ant-breadcrumb-link]:leading-6
          [&_.ant-breadcrumb-link]:truncate

          [&_.ant-breadcrumb-separator]:mx-2
          [&_.ant-breadcrumb-separator]:inline-flex
          [&_.ant-breadcrumb-separator]:h-6
          [&_.ant-breadcrumb-separator]:items-center
          [&_.ant-breadcrumb-separator]:justify-center
          [&_.ant-breadcrumb-separator]:leading-none
        "
      />
    </div>
  );
}