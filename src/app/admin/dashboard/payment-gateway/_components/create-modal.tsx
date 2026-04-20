"use client";

import useSubmit from "@/hooks/use-submit";
import { useSwal } from "@/hooks/use-swal";
import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateGatewayModal({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const swal = useSwal();

  const { handler, loading } = useSubmit(async () => {
    await Promise.resolve(setTimeout(() => {}, 1000));
    swal.success("Created gateway.");
    onClose();
  });

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      title="Add Payment Gateway"
      open={open}
      onCancel={onClose}
      onOk={handler}
      loading={loading}
      okText="Create"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Gateway Name"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. Razorpay" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input placeholder="e.g. razorpay" />
        </Form.Item>

        <Form.Item name="status" label="Status" initialValue="active">
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
