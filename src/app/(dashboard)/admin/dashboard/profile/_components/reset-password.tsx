"use client";

import { Button, Card, Col, Form, Input, Row } from "antd";
import { useMutation } from "@tanstack/react-query";

import api, { getApiErrorMessage } from "@/lib/axios";
import { useSwal } from "@/hooks/use-swal";

type ResetPasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export default function ResetPassword() {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const swal = useSwal();

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await api.post("/auth/reset", payload);
      return response.data;
    },

    onSuccess: () => {
      swal.success("Password reset successfully");
      form.resetFields();
    },

    onError: (error) => {
      swal.error(getApiErrorMessage(error));
    },
  });

  const onFinish = (values: ResetPasswordFormValues) => {
    const { oldPassword, newPassword } = values;

    resetPasswordMutation.mutate({
      oldPassword,
      newPassword,
    });
  };

  return (
    <Card title="Reset Password">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="oldPassword"
              label="Old Password"
              rules={[
                {
                  required: true,
                  message: "Old password is required",
                },
              ]}
            >
              <Input.Password placeholder="OldPassword@123" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "New password is required",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
            >
              <Input.Password placeholder="NewPassword@123" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Confirm password is required",
                },
                {
                  min: 6,
                  message: "Confirm password must be at least 6 characters",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "New password and confirm password do not match",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="NewPassword@123" />
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          loading={resetPasswordMutation.isPending}
        >
          Reset Password
        </Button>
      </Form>
    </Card>
  );
}