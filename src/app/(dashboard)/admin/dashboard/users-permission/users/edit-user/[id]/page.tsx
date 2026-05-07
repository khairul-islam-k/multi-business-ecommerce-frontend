"use client";

import PageHeader from "@/components/shared/page-header";
import { adminBreadcrumb } from "@/config/breadcrumb.config";
import { Card, Form, Input, Select, Row, Col, Button } from "antd";
import { useEffect } from "react";
import api from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/searchable-select";

const { TextArea } = Input;

export default function EditUserPage() {
  const [form] = Form.useForm();
  const swal = useSwal();
  const router = useRouter();
  const { id } = useParams();

  /* =========================
     FETCH USER
  ========================= */
  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  /* =========================
     HYDRATE FORM
  ========================= */
  useEffect(() => {
    if (!user) return;

    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      user_type: user.user_type,

      gender: user.profile?.gender,
      date_of_birth: user.profile?.date_of_birth,
      address: user.profile?.address,
      city: user.profile?.city,
      state: user.profile?.state,
      postal_code: user.profile?.postal_code,
      country: user.profile?.country,
      emergency_contact: user.profile?.emergency_contact,
      notes: user.profile?.notes,

      role_ids: user.roles?.map((r: any) => r.id) || [],
    });
  }, [user, form]);

  /* =========================
     SUBMIT
  ========================= */
  const onFinish = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        status: values.status,
        user_type: values.user_type,
        role_ids: values.role_ids,

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

      await api.patch(`/users/${id}`, payload);

      swal.success("Updated successfully");
      router.push("/admin/dashboard/users-permission/users");
    } catch {
      swal.error("Update failed");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <PageHeader title="Edit User" breadcrumb={adminBreadcrumb} />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          {/* ================= ACCOUNT ================= */}
          <Col xs={24} md={12}>
            <Card title="Account">
              <Form.Item name="name" label="Name">
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item name="email" label="Email">
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input placeholder="Phone" />
              </Form.Item>

              <Form.Item name="status" label="Status">
                <Select>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </Form.Item>

              <Form.Item name="user_type" label="User Type">
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
          Update
        </Button>
      </Form>
    </div>
  );
}
