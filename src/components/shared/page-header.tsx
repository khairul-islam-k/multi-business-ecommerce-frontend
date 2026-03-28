import { Typography } from "antd";

import Breadcrumbs from "./breadcrumb";

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
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <Title level={4} style={{ marginBottom: 0 }}>
        {title}
      </Title>

      <Breadcrumbs {...breadcrumb} />
    </div>
  );
}
