import { Table, Checkbox } from "antd";

import { mockModules } from "../data";

export default function ModuleMatrixTable({
  packages,
  matrix,
  onToggle,
}: {
  packages: any[];
  matrix: Record<string, Record<string, boolean>>;
  onToggle: (moduleId: string, packageName: string, value: boolean) => void;
}) {
  const columns = [
    {
      title: "Module",
      dataIndex: "name",
      fixed: "left" as const,
      width: 200,
    },
    ...packages.map((p) => ({
      title: p.name,
      align: "center" as const,
      render: (_: any, record: any) => (
        <Checkbox
          checked={matrix[record.id]?.[p.name]}
          onChange={(e) => onToggle(record.id, p.name, e.target.checked)}
        />
      ),
    })),
  ];

  const data = mockModules.map((m) => ({
    key: m.id,
    id: m.id,
    name: m.name,
  }));

  return <Table columns={columns} dataSource={data} pagination={false} />;
}
