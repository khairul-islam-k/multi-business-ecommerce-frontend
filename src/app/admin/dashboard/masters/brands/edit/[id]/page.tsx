"use client";

import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Card,
  theme,
  message,
} from "antd";

import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import useSubmit from "@/hooks/use-submit";
import { queryClient } from "@/providers/query-provider";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import Loader from "@/components/shared/loader";

export default function EditBrandPage() {
  const { id: uuid } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { data, isLoading } = useQuery({
    queryKey: ["brand", uuid],
    queryFn: async () => api.get(`/brands/${uuid}`).then((res) => res.data),
  });

  const { loading, handler } = useSubmit(async (values: any) => {
    try {
      await api.patch(`/brands/${uuid}`, values);

      message.success("Brand updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["fetch-brands"] });

      router.push("/admin/dashboard/masters/brands");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to update brand");
    }
  });

  if (isLoading) return <Loader />;

  const brand = data?.data ?? data;

  if (!brand) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Brand" breadcrumb={adminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        initialValues={brand}
        onFinish={handler}
        className="space-y-6"
        style={{ background: token.colorBgBase }}
      >
        {/* BASIC INFO */}
        <Card title="Basic Information" className="rounded-xl">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Brand Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* STATUS */}
        <Card title="Status" className="rounded-xl">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="status" label="Brand Status">
                <Select
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ACTION */}
        <Card className="rounded-xl bg-gray-50">
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Brand
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
}
