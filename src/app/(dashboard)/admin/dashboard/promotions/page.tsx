"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Space, Modal, Descriptions } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { mockPromotions, Promotion } from "./data";
import StatusBadge from "./_components/status-badge";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { DataTable, Column } from "@/components/shared/data-table";

const columns: Column<Promotion>[] = [
  { key: "name", label: "Promotion" },

  {
    key: "promotion_type",
    label: "Type",
    render: (r) => (
      <span className="capitalize">{r.promotion_type.replace("_", " ")}</span>
    ),
  },

  {
    key: "discount_value",
    label: "Discount",
    render: (r) =>
      r.discount_type === "percentage"
        ? `${r.discount_value}%`
        : `$${r.discount_value}`,
  },

  {
    key: "start_at",
    label: "Start",
    render: (r) => new Date(r.start_at).toLocaleDateString(),
  },

  {
    key: "end_at",
    label: "End",
    render: (r) => new Date(r.end_at).toLocaleDateString(),
  },

  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge status={r.status} />,
  },
];

export default function PromotionList() {
  const router = useRouter();

  const [selected, setSelected] = useState<Promotion | null>(null);
  const [open, setOpen] = useState(false);

  const handleView = (row: Promotion) => {
    setSelected(row);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Promotions" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockPromotions}
        columns={columns}
        toolbarEnd={
          <Link href="/admin/dashboard/promotions/create">
            <Button type="primary">Create Promotion</Button>
          </Link>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(row)}
            />
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/admin/dashboard/promotions/${row.id}/edit`)
              }
            />
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Space>
        )}
      />

      {/* Details Modal */}
      <Modal
        title="Promotion Details"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">{selected.name}</Descriptions.Item>

            <Descriptions.Item label="Type">
              <span className="capitalize">
                {selected.promotion_type.replace("_", " ")}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Discount">
              {selected.discount_type === "percentage"
                ? `${selected.discount_value}%`
                : `$${selected.discount_value}`}
            </Descriptions.Item>

            <Descriptions.Item label="Start Date">
              {new Date(selected.start_at).toLocaleString()}
            </Descriptions.Item>

            <Descriptions.Item label="End Date">
              {new Date(selected.end_at).toLocaleString()}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <StatusBadge status={selected.status} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
