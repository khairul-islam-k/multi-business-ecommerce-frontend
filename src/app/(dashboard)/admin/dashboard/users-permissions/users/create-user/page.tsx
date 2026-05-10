"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Col, Empty, Form, Input, Row, Select } from "antd";

import { useSwal } from "@/hooks/use-swal";
import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useEmployeeMutations, useRoles } from "@/lib/api";

type CreateEmployeeValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  status?: string;
  roleIds?: number[];
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
};

const { TextArea } = Input;

export default function CreateUserPage() {
  const [form] = Form.useForm<CreateEmployeeValues>();
  const swal = useSwal();
  const router = useRouter();
  const businessId = useActiveBusinessId();
  const rolesQuery = useRoles(businessId ?? undefined, { limit: 100 });
  const { createEmployee } = useEmployeeMutations(businessId ?? 0);

  const onFinish = async (values: CreateEmployeeValues) => {
    if (!businessId) return;

    if (values.password !== values.confirmPassword) {
      swal.error("Passwords do not match.");
      return;
    }

    try {
      await createEmployee.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        status: values.status,
        roleIds: values.roleIds ?? [],
        profile: {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          address: values.address,
          city: values.city,
          country: values.country,
          bio: values.bio,
        },
      });

      swal.success("Employee created successfully.");
      form.resetFields();
      router.push("/admin/dashboard/users-permissions/users");
    } catch (error) {
      swal.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) {
    return <Empty description="No active business selected" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Employee"
        subtitle="Creates an employee for the active business."
        breadcrumb={adminBreadcrumb}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: "ACTIVE" }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Card title="Account">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
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
                <Input.Password />
              </Form.Item>

              <Form.Item name="status" label="Status">
                <Select
                  options={[
                    { label: "Active", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                    { label: "Suspended", value: "SUSPENDED" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="roleIds" label="Roles">
                <Select
                  mode="multiple"
                  loading={rolesQuery.isLoading}
                  options={(rolesQuery.data?.items ?? []).map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Profile">
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="firstName" label="First Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="lastName" label="Last Name">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="gender" label="Gender">
                <Select
                  allowClear
                  options={[
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                    { label: "Other", value: "OTHER" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="dateOfBirth" label="Date of Birth">
                <Input type="date" />
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>

              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="city" label="City">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="country" label="Country">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="bio" label="Bio">
                <TextArea rows={3} />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <div className="mt-4 flex gap-2">
          <Button type="primary" htmlType="submit" loading={createEmployee.isPending}>
            Create Employee
          </Button>
          <Button onClick={() => router.push("/admin/dashboard/users-permissions/users")}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
