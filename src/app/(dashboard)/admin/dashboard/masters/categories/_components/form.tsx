"use client";

import { useQuery } from "@tanstack/react-query";
import { Form as AntdForm, Input, Select, Button, Row, Col } from "antd";

import api from "@/lib/axios";
import useSubmit from "@/hooks/use-submit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Form({ initialValues, mode, onSubmit }: any) {
  const [form] = AntdForm.useForm();

  const { loading, handler } = useSubmit(onSubmit);

  // -----------------------------
  // fetch categories for parent
  // -----------------------------
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories")).data?.data?.data ?? [],
  });

  const categories = data ?? [];

  return (
    <AntdForm
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={handler}
    >
      <Row gutter={[16, 16]}>
        {/* NAME */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </AntdForm.Item>
        </Col>

        {/* SLUG */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="slug" label="Slug">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* PARENT CATEGORY */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="parent_id" label="Parent Category">
            <Select
              allowClear
              loading={isLoading}
              placeholder="Select parent category"
              options={categories
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((c: any) => c.id !== initialValues?.id) // prevent self-parent (edit)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: any) => ({
                  label: c.name,
                  value: c.id,
                }))}
            />
          </AntdForm.Item>
        </Col>

        {/* IMAGE */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="image_url" label="Image URL">
            <Input />
          </AntdForm.Item>
        </Col>

        {/* STATUS */}
        <Col xs={24} md={12}>
          <AntdForm.Item name="status" label="Status" initialValue="Active">
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </AntdForm.Item>
        </Col>

        {/* DESCRIPTION */}
        <Col span={24}>
          <AntdForm.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </AntdForm.Item>
        </Col>

        {/* SUBMIT */}
        <Col span={24}>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === "add" ? "Create Category" : "Update Category"}
            </Button>
          </div>
        </Col>
      </Row>
    </AntdForm>
  );
}
