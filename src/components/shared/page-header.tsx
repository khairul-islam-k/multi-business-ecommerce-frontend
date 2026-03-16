import { Typography } from "antd";

import Breadcrumbs from "./breadcrumb";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const { Title } = Typography;

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <Title level={4} style={{ marginBottom: 0 }}>
        {title}
      </Title>
      <Breadcrumbs />
    </div>
  );
}
