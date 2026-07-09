"use client";

import {
  Pencil,
  Trash2
} from "lucide-react";


import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { DataTable, Column } from "@/components/shared/data-table";
import { mockRules, mockPromotions, PromotionRule } from "../data";

import { useState } from "react";
import { Button, Modal, Form, Input, Select, Space, Tag } from "antd";

const promoMap = Object.fromEntries(mockPromotions.map((p) => [p.id, p.name]));

const columns: Column<PromotionRule>[] = [
  {
    key: "promotion_id",
    label: "Promotion",
    render: (r) => promoMap[r.promotion_id] || "Unknown",
  },
  {
    key: "rule_type",
    label: "Rule Type",
    render: (r) => <Tag>{r.rule_type.replace("_", " ")}</Tag>,
  },
  { key: "rule_value", label: "Value" },
];

export default function PromotionRulesBuilder() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PromotionRule | null>(null);
  const [form] = Form.useForm();

  const handleOpen = (rule?: PromotionRule) => {
    setSelected(rule || null);
    setOpen(true);
    form.setFieldsValue(rule || {});
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Promotion Rules" breadcrumb={adminBreadcrumb} />

      <DataTable
        data={mockRules}
        columns={columns}
        toolbarEnd={
          <Button type="primary" onClick={() => handleOpen()}>
            Add Rule
          </Button>
        }
        actions={(row) => (
          <Space>
            <Button
              type="text"
              icon={<Pencil />}
              onClick={() => handleOpen(row)}
            />
            <Button type="text" danger icon={<Trash2 />} />
          </Space>
        )}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          form.validateFields().then(() => {
            setOpen(false);
          });
        }}
        title={selected ? "Edit Rule" : "Add Rule"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="promotion_id"
            label="Promotion"
            rules={[{ required: true }]}
          >
            <Select
              options={mockPromotions.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="rule_type"
            label="Rule Type"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                "min_order",
                "max_discount",
                "category",
                "customer_segment",
                "min_quantity",
                "payment_method",
              ].map((t) => ({
                label: t.replace("_", " "),
                value: t,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="rule_value"
            label="Value"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
