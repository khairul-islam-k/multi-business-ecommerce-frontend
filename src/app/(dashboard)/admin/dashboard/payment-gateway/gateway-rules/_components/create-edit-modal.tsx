"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  mode?: "create" | "edit";
}

export default function CreateEditRuleModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  mode = "create",
}: Props) {
  const [form] = Form.useForm();
  const swal = useSwal();

  const { handler, loading } = useSubmit(async () => {
    const values = await form.validateFields();
    onSubmit(values);
    form.resetFields();
    onClose();
    swal.success(`Rule ${mode === "create" ? "Created" : "Edited"}`);
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialValues || {
          name: "",
          condition: "",
          gateway: "",
          priority: "",
          status: "active",
        },
      );
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={mode === "edit" ? "Edit Rule" : "Add Rule"}
      open={open}
      onCancel={onClose}
      onOk={handler}
      okText={mode === "edit" ? "Update" : "Create"}
      loading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Rule Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="condition"
          label="Condition"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="gateway" label="Gateway" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
