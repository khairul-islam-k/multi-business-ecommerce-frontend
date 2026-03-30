import { Table, Tag, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function PackageListTable({
  data,
  onDelete,
}: {
  data: any[];
  onDelete: (record: any) => void;
}) {
  const router = useRouter();

  const columns = [
    {
      title: "Package",
      dataIndex: "name",
      render: (t: string) => <strong>{t}</strong>,
    },
    {
      title: "Monthly",
      dataIndex: "monthlyPrice",
      render: (v: number) => `$${v}`,
    },
    {
      title: "Yearly",
      dataIndex: "yearlyPrice",
      render: (v: number) => `$${v}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag>
      ),
    },
    {
      title: "Subscribers",
      dataIndex: "subscribers",
    },
    {
      title: "Actions",
      width: 80,
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              router.push(`/super-admin/dashboard/packages/edit/${record.id}`)
            }
          />

          <Popconfirm
            title="Delete package?"
            description="This action cannot be undone"
            onConfirm={() => onDelete(record)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}
