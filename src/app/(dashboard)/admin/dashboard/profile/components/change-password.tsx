"use client";

import { Form, Input, Button, Card, Space } from "antd";

const ChangePassword = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Password Data:", values);
    form.resetFields();
  };

  const onCancel = () => {
    form.resetFields();
  };

  return (
    <Card title="Change Password" style={{ maxWidth: 500 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Current Password */}
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Current password is required" }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        {/* New Password */}
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "New password is required" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        {/* Buttons */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Update Password
            </Button>

            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePassword;
