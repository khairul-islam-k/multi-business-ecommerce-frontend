"use client";

import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from "antd";

import api, { getApiErrorMessage } from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";

type Gender = "MALE" | "FEMALE" | "OTHER";

type MeResponse = {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      type: string;
      status: string;
      businessId: string;
      createdAt: string;
      updatedAt: string;
    };
    profile: {
      id: string;
      userId: string;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
      dateOfBirth: string | null;
      gender: Gender | null;
      address: string | null;
      city: string | null;
      country: string | null;
      bio: string | null;
    } | null;
  };
};

type MeData = MeResponse["data"];

type EditProfileFormValues = {
  name: string;
  phone?: string;
  profile: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    dateOfBirth?: Dayjs;
    gender?: Gender;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
  };
};

export default function EditProfile() {
  const [form] = Form.useForm<EditProfileFormValues>();
  const queryClient = useQueryClient();
  const swal = useSwal();

  const { data: me, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<MeData> => {
      const response = await api.get<MeResponse>("/auth/me");
      return response.data.data;
    },
  });

  React.useEffect(() => {
    if (!me) return;

    form.setFieldsValue({
      name: me.user.name,
      phone: "",
      profile: {
        firstName: me.profile?.firstName || "",
        lastName: me.profile?.lastName || "",
        imageUrl: me.profile?.imageUrl || "",
        dateOfBirth: me.profile?.dateOfBirth
          ? dayjs(me.profile.dateOfBirth)
          : undefined,
        gender: me.profile?.gender || undefined,
        address: me.profile?.address || "",
        city: me.profile?.city || "",
        country: me.profile?.country || "",
        bio: me.profile?.bio || "",
      },
    });
  }, [me, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: EditProfileFormValues) => {
      if (!me?.user.id) {
        throw new Error("User not found");
      }

      const payload = {
        name: values.name,
        phone: values.phone || undefined,
        profile: {
          firstName: values.profile.firstName || undefined,
          lastName: values.profile.lastName || undefined,
          imageUrl: values.profile.imageUrl || undefined,
          dateOfBirth: values.profile.dateOfBirth
            ? values.profile.dateOfBirth.format("YYYY-MM-DD")
            : undefined,
          gender: values.profile.gender || undefined,
          address: values.profile.address || undefined,
          city: values.profile.city || undefined,
          country: values.profile.country || undefined,
          bio: values.profile.bio || undefined,
        },
      };

      const response = await api.patch(`/auth/profile/update`, payload);
      return response.data;
    },
    onSuccess: () => {
      swal.success("Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
    onError: (error) => {
      swal.error(getApiErrorMessage(error));
    },
  });

  const onFinish = (values: EditProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <Card title="Edit Profile" loading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="+8801711111111" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "firstName"]} label="First Name">
              <Input placeholder="John" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "lastName"]} label="Last Name">
              <Input placeholder="Doe" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "imageUrl"]} label="Image URL">
              <Input placeholder="https://example.com/avatar.jpg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "dateOfBirth"]} label="Date of Birth">
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder="Select date of birth"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "gender"]} label="Gender">
              <Select
                placeholder="Select gender"
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "country"]} label="Country">
              <Input placeholder="Bangladesh" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "city"]} label="City">
              <Input placeholder="Dhaka" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name={["profile", "address"]} label="Address">
              <Input placeholder="House 10, Road 5" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name={["profile", "bio"]} label="Bio">
              <Input.TextArea
                rows={4}
                placeholder="Senior sales employee."
              />
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          loading={updateProfileMutation.isPending}
        >
          Update Profile
        </Button>
      </Form>
    </Card>
  );
}