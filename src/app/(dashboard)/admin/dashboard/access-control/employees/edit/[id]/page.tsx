"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { App, Button, Card, Col, Empty, Form, Input, Row, Select } from "antd";

import { getApiErrorMessage } from "@/lib/axios";
import { useActiveBusinessId } from "@/hooks/use-active-business";
import PageHeader from "@/components/shared/page-header";
import Loader from "@/components/shared/loader";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import {
  useEmployee,
  useEmployeeMutations,
  useRoles,
} from "@/lib/api";
import type { Employee } from "@/lib/api";
import type { ApiId } from "@/lib/api";

type EditEmployeeValues = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
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

const getEmployeeRoles = (employee?: Employee) =>
  employee?.roles ?? employee?.userRoleMaps?.map((map) => map.role) ?? [];

export default function EditUserPage() {
  const [form] = Form.useForm<EditEmployeeValues>();
  const { message } = App.useApp();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const businessId = useActiveBusinessId();
  const employeeId = id;


  const employeeQuery = useEmployee(businessId ?? undefined, employeeId);
  const rolesQuery = useRoles(businessId ?? undefined, { limit: 100 });
  const { updateEmployee, updateEmployeeStatus, replaceEmployeeRoles } =
    useEmployeeMutations(businessId ?? "");
  const roleOptions = useMemo(() => {
    const options = new Map<ApiId, { label: string; value: ApiId }>();

    (rolesQuery.data?.items ?? []).forEach((role) => {
      options.set(role.id, { label: role.name, value: role.id });
    });

    getEmployeeRoles(employeeQuery.data).forEach((role) => {
      options.set(role.id, { label: role.name, value: role.id });
    });

    return Array.from(options.values());
  }, [employeeQuery.data, rolesQuery.data?.items]);

  useEffect(() => {
    const employee = employeeQuery.data;
    if (!employee) return;

    form.setFieldsValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone ?? undefined,
      status: employee.status,
      roleIds: getEmployeeRoles(employee).map((role) => role.id),
      firstName: employee.profile?.firstName ?? undefined,
      lastName: employee.profile?.lastName ?? undefined,
      gender: employee.profile?.gender,
      dateOfBirth: employee.profile?.dateOfBirth ?? undefined,
      address: employee.profile?.address ?? undefined,
      city: employee.profile?.city ?? undefined,
      country: employee.profile?.country ?? undefined,
      bio: employee.profile?.bio ?? undefined,
    });
  }, [employeeQuery.data, form]);

  const onFinish = async (values: EditEmployeeValues) => {
    if (!businessId) return;

    try {
      await updateEmployee.mutateAsync({
        employeeId,
        payload: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password || undefined,
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
        },
      });

      if (values.status) {
        await updateEmployeeStatus.mutateAsync({
          employeeId,
          payload: { status: values.status },
        });
      }

      await replaceEmployeeRoles.mutateAsync({
        employeeId,
        payload: { roleIds: values.roleIds ?? [] },
      });

      message.success("Employee updated successfully.");
      router.push("/admin/dashboard/access-control/employees");
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  };

  if (!businessId) return <Empty description="No active business selected" />;

  if (employeeQuery.isLoading) {
    return (
      <Loader
        label="Loading employee"
        description="Fetching the employee account and assigned roles."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Employee"
        subtitle="Update account, profile, status, and role assignments for this employee."
        breadcrumb={adminBreadcrumb}
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
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

              <Form.Item name="password" label="New Password">
                <Input.Password placeholder="Leave blank to keep current password" />
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
                  options={roleOptions}
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
            loading={
              updateEmployee.isPending ||
              updateEmployeeStatus.isPending ||
              replaceEmployeeRoles.isPending
            }
          >
            Update Employee
          </Button>
          <Button onClick={() => router.push("/admin/dashboard/access-control/employees")}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
