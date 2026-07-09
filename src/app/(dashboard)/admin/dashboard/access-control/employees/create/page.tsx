"use client";

import { useRouter } from "next/navigation";
import { App, Button, Card, Col, Empty, Form, Input, Row, Select } from "antd";
import { allCountries } from "country-telephone-data";

import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { useEmployeeMutations, useRoles } from "@/lib/api";
import type { ApiId } from "@/lib/api";

type CreateEmployeeValues = {
  name: string;
  email: string;
  countryCode?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  status?: string;
  roleIds?: ApiId[];
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

const phoneCodeOptions = [
  {
    label: "Bangladesh (+880)",
    value: "BD|880",
  },
  ...allCountries
    .map((country) => ({
      label: `${country.name} (+${country.dialCode})`,
      value: `${country.iso2.toUpperCase()}|${country.dialCode}`,
    }))
    .filter((country) => country.value !== "BD|880"),
];

export default function CreateUserPage() {
  const [form] = Form.useForm<CreateEmployeeValues>();
  const { message } = App.useApp();
  const router = useRouter();
  const businessId = useActiveBusinessId();
  const rolesQuery = useRoles(businessId ?? undefined, { limit: 100 });
  const { createEmployee } = useEmployeeMutations(businessId ?? "");

  const onFinish = async (values: CreateEmployeeValues) => {
    if (!businessId) return;

    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    const phoneNumber = values.phone?.trim().replace(/\s+/g, "");
    const dialCode = values.countryCode?.split("|")[1] ?? "880";

    const fullPhoneNumber = phoneNumber
      ? phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${dialCode}${phoneNumber.replace(/^0+/, "")}`
      : undefined;

    console.log(fullPhoneNumber, 'phone');
    const payload = {
      name: values.name,
      email: values.email,
      phone: fullPhoneNumber,
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
    }

    console.log('payload', payload);

    try {
      await createEmployee.mutateAsync(payload);

      message.success("Employee created successfully.");
      form.resetFields();
      router.push("/admin/dashboard/access-control/employees");
    } catch (error) {
      message.error(getApiErrorMessage(error));
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
        initialValues={{
          status: "ACTIVE",
          countryCode: "BD|880",
        }}
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

              <Row gutter={12}>
                <Col xs={24} md={10}>
                  <Form.Item name="countryCode" label="Country Code">
                    <Select
                      showSearch
                      placeholder="Code"
                      optionFilterProp="label"
                      options={phoneCodeOptions}
                      filterOption={(input, option) =>
                        String(option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={14}>
                  <Form.Item name="phone" label="Phone">
                    <Input placeholder="1712345678" />
                  </Form.Item>
                </Col>
              </Row>

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
                        new Error("Passwords do not match")
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
                  showSearch
                  loading={rolesQuery.isLoading}
                  optionFilterProp="label"
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
          <Button
            type="primary"
            htmlType="submit"
            loading={createEmployee.isPending}
          >
            Create Employee
          </Button>

          <Button
            onClick={() =>
              router.push("/admin/dashboard/access-control/employees")
            }
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}