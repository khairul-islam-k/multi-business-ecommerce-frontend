"use client";

import {
  Form,
  Input,
  Select,
  Upload,
  Row,
  Col,
  Button,
  message,
  theme,
  DatePicker,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";
import useSubmit from "@/hooks/use-submit";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useSwal } from "@/hooks/use-swal";

const { Option } = Select;

export default function CreateTenantForm() {
  const swal = useSwal();
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { loading, handler } = useSubmit(async (values: any) => {
    if (values.password && values.password !== values.confirmPassword) {
      swal.error("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("businessName", values.businessName);
      formData.append("ownerName", values.ownerName);
      formData.append("slug", values.slug);
      formData.append("email", values.email);

      if (values.phone) formData.append("phone", values.phone);
      if (values.password) formData.append("password", values.password);

      formData.append("status", values.status);

      if (values.trial_ends) {
        formData.append(
          "trial_ends",
          dayjs(values.trial_ends).format("YYYY-MM-DD"),
        );
      }

      formData.append("currency", values.currency);
      formData.append("time_zone", values.time_zone);

      if (file) {
        formData.append("logo", file);
      }

      await api.post("/auth-tenant", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      swal.success("Tenant created successfully!");

      form.resetFields();
      setFile(null);
      setFileName("");

      router.push("/super-admin/dashboard/tenants");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      swal.error(err?.response?.data?.message || "Failed to create tenant");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Create Tenant" breadcrumb={superAdminBreadcrumb} />

      <Form
        layout="vertical"
        form={form}
        onFinish={handler}
        style={{
          background: token.colorBgBase,
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Business Name"
              name="businessName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Owner Name"
              name="ownerName"
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

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="+880..." />
            </Form.Item>
          </Col>

          {/* ✅ LOGO */}
          <Col xs={24} md={12}>
            <Form.Item label="Logo">
              <Upload
                beforeUpload={(file) => {
                  if (file.size / 1024 / 1024 > 2) {
                    swal.error("File must be under 2MB");
                    return Upload.LIST_IGNORE;
                  }
                  setFile(file);
                  setFileName(file.name);
                  return false;
                }}
                showUploadList={false}
              >
                <Input
                  value={fileName}
                  placeholder="Upload logo"
                  readOnly
                  suffix={<UploadOutlined />}
                />
              </Upload>
            </Form.Item>
          </Col>

          {/* ✅ PASSWORD */}
          <Col xs={24} md={12}>
            <Form.Item name="password" label="Password">
              <Input.Password
                iconRender={(v) =>
                  v ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                iconRender={(v) =>
                  v ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>

          {/* ✅ STATUS */}
          <Col xs={24} md={12}>
            <Form.Item name="status" label="Status" initialValue="Active">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Trial">Trial</Option>
                <Option value="Suspended">Suspended</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* ✅ TRIAL ENDS (date, not number anymore) */}
          <Col xs={24} md={12}>
            <Form.Item name="trial_ends" label="Trial Ends">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* ✅ CURRENCY */}
          <Col xs={24} md={12}>
            <Form.Item name="currency" label="Currency" initialValue="USD">
              <Select>
                <Option value="USD">USD</Option>
                <Option value="BDT">BDT</Option>
                <Option value="EUR">EUR</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* ✅ TIME ZONE */}
          <Col xs={24} md={12}>
            <Form.Item
              name="time_zone"
              label="Time Zone"
              initialValue="Asia/Dhaka"
            >
              <Select>
                <Option value="Asia/Dhaka">Asia/Dhaka</Option>
                <Option value="UTC">UTC</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Tenant
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
