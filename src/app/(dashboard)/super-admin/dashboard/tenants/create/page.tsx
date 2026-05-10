"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Col, Form, Input, Row } from "antd";

import { authApi } from "@/lib/api";
import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import PageHeader from "@/components/shared/page-header";
import { superAdminBreadcrumb } from "@/config/breadcrumb.config";

type CreateTenantValues = {
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
};

export default function CreateTenantForm() {
  const swal = useSwal();
  const [form] = Form.useForm<CreateTenantValues>();
  const router = useRouter();

  const handleSubmit = async (values: CreateTenantValues) => {
    if (values.password !== values.confirmPassword) {
      swal.error("Passwords do not match.");
      return;
    }

    try {
      await authApi.register({
        name: values.ownerName,
        email: values.email,
        password: values.password,
        businessName: values.businessName,
      });

      swal.success("Tenant account created successfully.");
      form.resetFields();
      router.push("/super-admin/dashboard/tenants");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Tenant"
        subtitle="Creates a tenant user and their first business using the live auth API."
        breadcrumb={superAdminBreadcrumb}
      />

      <Card>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            businessName: "New Business",
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Owner Name"
                name="ownerName"
                rules={[{ required: true, message: "Owner name is required" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Business Name"
                name="businessName"
                rules={[
                  { required: true, message: "Business name is required" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Confirm the password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Passwords do not match"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex flex-wrap gap-2">
            <Button type="primary" htmlType="submit">
              Create Tenant
            </Button>
            <Button onClick={() => router.push("/super-admin/dashboard/tenants")}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
