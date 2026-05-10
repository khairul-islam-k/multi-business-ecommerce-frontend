"use client";

import type React from "react";
import { Typography } from "antd";

import Breadcrumbs from "./breadcrumb";
import useWidth from "@/hooks/use-width";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb: {
    basePath: string;
    labels: Record<string, string>;
    sliceIndex?: number;
  };
}

const { Title } = Typography;

export default function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  const width = useWidth();

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 border-b border-black/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Title level={4} style={{ marginBottom: 0 }}>
          {title}
        </Title>

        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:items-end">
        <Breadcrumbs {...breadcrumb} maxItems={width > 512 ? 5 : 3} />
        {actions}
      </div>
    </div>
  );
}
