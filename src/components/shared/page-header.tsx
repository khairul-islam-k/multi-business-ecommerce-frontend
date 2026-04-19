"use client";

import { Typography } from "antd";

import Breadcrumbs from "./breadcrumb";
import useWidth from "@/hooks/use-width";

interface PageHeaderProps {
  title: string;
  breadcrumb: {
    basePath: string;
    labels: Record<string, string>;
    sliceIndex?: number;
  };
}

const { Title } = Typography;

export default function PageHeader({ title, breadcrumb }: PageHeaderProps) {
  const width = useWidth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full min-w-0">
      <Title level={4} style={{ marginBottom: 0 }}>
        {title}
      </Title>

      <div className="min-w-0 overflow-hidden">
        <Breadcrumbs {...breadcrumb} maxItems={width > 512 ? 5 : 3} />
      </div>
    </div>
  );
}
