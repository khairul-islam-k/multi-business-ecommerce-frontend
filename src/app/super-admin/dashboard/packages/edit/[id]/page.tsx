"use client";

import { notFound, useParams } from "next/navigation";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Button,
  theme,
  message,
} from "antd";

import { mockPackages } from "../../data";
import useSubmit from "@/hooks/use-submit";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

const { Option } = Select;
const { TextArea } = Input;

export default function EditPackage() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { loading, handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    message.success("Addon updated!");
  });

  const _package = mockPackages.find((_package) => id === _package.id);

  if (!_package) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Package" breadcrumb={superAdminBreadcrumb} />

      <Form
        initialValues={{ ..._package }}
        layout="vertical"
        form={form}
        onFinish={(values) => handler(values)}
        style={{
          maxWidth: "100%",
          background: token.colorBgBase,
          padding: "15px",
          borderRadius: "8px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Package name"
              name="name"
              rules={[{ required: true, message: "Package name is required" }]}
            >
              <Input placeholder="Package name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Slug"
              name="slug"
              rules={[{ required: true, message: "Slug is required" }]}
            >
              <Input placeholder="Slug" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Monthly price ($)"
              name="monthlyPrice"
              rules={[
                { required: true, message: "Price is required" },
                { type: "number", message: "Invalid price" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="20" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Yearly price ($)" name="yearlyPrice">
              <InputNumber style={{ width: "100%" }} placeholder="415" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item label="Description" name="description">
              <TextArea
                rows={4}
                placeholder="maxLength is 200"
                maxLength={200}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Status" name="status">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="InActive">INActive</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Type" name="type">
              <Select>
                <Option value="Usage">Usage</Option>
                <Option value="Per Unit">Per Unit</Option>
                <Option value="Flat">Flat</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
