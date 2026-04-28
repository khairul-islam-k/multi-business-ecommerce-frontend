import { Table, InputNumber, Button } from "antd";

import { mockLimits } from "../data";

export default function LimitSettingsTable({ packages }: { packages: any[] }) {
  const columns = [
    {
      title: "Limit",
      dataIndex: "label",
      fixed: "left" as const,
      width: 200,
    },
    ...packages.map((p) => ({
      title: p.name,
      align: "center" as const,
      render: (_: any, record: any) => (
        <InputNumber
          defaultValue={record.values[p.name]}
          style={{ width: 100 }}
        />
      ),
    })),
  ];

  const data = mockLimits.map((l) => ({
    key: l.key,
    label: l.label,
    values: l.values,
  }));

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button type="primary">Save Limits</Button>
      </div>
    </>
  );
}
