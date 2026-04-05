"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/page-header";
import { DataTable, Column } from "@/components/shared/data-table";
import { Button, Modal, Form, Input, Select, message, Tag } from "antd";
import { SettingOutlined, PlusOutlined } from "@ant-design/icons";
import { mockGateways, SmsGateway } from "./data";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import useSubmit from "@/hooks/use-submit";

const statusColor: Record<string, string> = {
  active: "green",
  inactive: "red",
};

const columns: Column<SmsGateway>[] = [
  { key: "name", label: "Gateway", sortable: true },
  { key: "slug", label: "Slug" },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterOptions: ["active", "inactive"],
    render: (r) => (
      <Tag color={statusColor[r.status]}>{r.status.toUpperCase()}</Tag>
    ),
  },
];

export default function SmsGatewaySettings() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SmsGateway | null>(null);
  const [form] = Form.useForm();

  const openModal = (gateway?: SmsGateway) => {
    setSelected(gateway || null);
    form.setFieldsValue(gateway || { status: "active" });
    setOpen(true);
  };

  const { handler, loading } = useSubmit(async () => {
    message.success("Gateway configuration saved!");
    setOpen(false);
  });

  return (
    <div className="space-y-6">
      <PageHeader title="SMS Gateway Settings" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockGateways}
        columns={columns}
        searchKeys={["name"]}
        toolbarEnd={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Gateway
          </Button>
        }
        actions={(row) => (
          <Button icon={<SettingOutlined />} onClick={() => openModal(row)} />
        )}
      />

      <Modal
        title={selected ? `Configure ${selected.name}` : "Add Gateway"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        loading={loading}
      >
        <Form layout="vertical" form={form} onFinish={handler}>
          <Form.Item label="Sender ID" name="sender">
            <Input placeholder="e.g. MyBrand" />
          </Form.Item>

          <Form.Item label="API Key" name="api_key">
            <Input.Password />
          </Form.Item>

          <Form.Item label="Secret Key" name="secret">
            <Input.Password />
          </Form.Item>

          <Form.Item label="Webhook URL" name="webhook">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Save Configuration
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
