"use client";

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

import useSubmit from "@/hooks/use-submit";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;
const { TextArea } = Input;

export default function CreatePackage() {
  const swal = useSwal();
  const [form] = Form.useForm();

  const { loading, handler } = useSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1000));
    swal.success("Addon updated!");
  });

  const { token } = theme.useToken();

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <PageHeader
          title="Create Package"
          breadcrumb={superAdminBreadcrumb}
        ></PageHeader>
      </div>

      <Form
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
              name="packageName"
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
            <Form.Item label="Status" name="status" initialValue="Active">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="InActive">INActive</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Type" name="type" initialValue="Usage">
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
            Create Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
