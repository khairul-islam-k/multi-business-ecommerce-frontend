"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Card, Form, Input, Select, Row, Col, Button } from "antd";
import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import SearchableSelect from "@/components/shared/searchable-select";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

export default function CreateUserPage() {
  const [form] = Form.useForm();
  const swal = useSwal();
  const router = useRouter();

  /* =========================
     SUBMIT
  ========================= */
  const onFinish = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        status: values.status,
        user_type: values.user_type,
        role_ids: values.role_ids || [],

        profile: {
          gender: values.gender,
          date_of_birth: values.date_of_birth,
          address: values.address,
          city: values.city,
          state: values.state,
          postal_code: values.postal_code,
          country: values.country,
          emergency_contact: values.emergency_contact,
          notes: values.notes,
        },
      };

      await api.post("/users", payload);

      swal.success("Created successfully");
      form.resetFields();
      router.push("/admin/dashboard/users-permission/users");
    } catch {
      swal.error("Create failed");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <PageHeader title="Create User" breadcrumb={adminBreadcrumb} />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* ================= ACCOUNT ================= */}
          <Col xs={24} md={12}>
            <Card title="Account">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input placeholder="Phone" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  { required: true },
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
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </Form.Item>

              <Form.Item
                name="user_type"
                label="User Type"
                rules={[{ required: true }]}
              >
                <Select>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </Select>
              </Form.Item>

              <Form.Item name="role_ids" label="Roles">
                <SearchableSelect
                  onChange={(roles) => {
                    form.setFieldsValue({ role_ids: roles });
                  }}
                  endpoint="/roles"
                  mode="multiple"
                  placeholder="Select roles"
                />
              </Form.Item>
            </Card>
          </Col>

          {/* ================= PROFILE ================= */}
          <Col xs={24} md={12}>
            <Card title="Profile">
              <Form.Item name="gender" label="Gender">
                <Select allowClear>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </Form.Item>

              <Form.Item name="date_of_birth" label="Date of Birth">
                <Input type="date" />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>

              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>

              <Form.Item name="state" label="State">
                <Input />
              </Form.Item>

              <Form.Item name="postal_code" label="Postal Code">
                <Input />
              </Form.Item>

              <Form.Item name="country" label="Country">
                <Input />
              </Form.Item>

              <Form.Item name="emergency_contact" label="Emergency Contact">
                <Input />
              </Form.Item>

              <Form.Item name="notes" label="Notes">
                <TextArea rows={3} />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Create
        </Button>
      </Form>
    </div>
  );
}
