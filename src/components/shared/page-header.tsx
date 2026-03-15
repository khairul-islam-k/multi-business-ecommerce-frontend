import Breadcrumbs from "./breadcrumb";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        <Breadcrumbs />
      </div>

      {children && (
        <div className="flex items-center gap-2 sm:mt-1">{children}</div>
      )}
    </div>
  );
}
