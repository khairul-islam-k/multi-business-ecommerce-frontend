"use client";

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Card, Form, Input, Button, Checkbox, Typography, Flex } from "antd";

import { login } from "../utils";
import useSubmit from "@/hooks/use-submit";
import Logo from "@/components/shared/logo";
import { LoginFormValues } from "../schemas";

const { Title, Text, Link } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();

  const { loading, handler } = useSubmit<LoginFormValues>(async (values) => {
    await login(values);
  });

  return (
    <Card style={{ width: 420 }}>
      <Flex vertical align="center" gap="small">
        <Logo />
        <Title level={3} style={{ margin: 0 }}>
          Admin Login
        </Title>
        <Text type="secondary">Sign in to manage your business</Text>
      </Flex>

      <Form<LoginFormValues>
        form={form}
        layout="vertical"
        onFinish={handler}
        initialValues={{ remember: true }}
      >
        <Form.Item<LoginFormValues>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email address" },
          ]}
        >
          <Input placeholder="example@email.com" />
        </Form.Item>

        <Form.Item<LoginFormValues>
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password
            placeholder="********"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Flex
          align="center"
          justify="space-between"
          style={{ width: "100%", paddingBlock: 8 }}
        >
          <Form.Item<LoginFormValues>
            name="remember"
            valuePropName="checked"
            noStyle
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link>Forgot password?</Link>
        </Flex>

        <Button loading={loading} type="primary" htmlType="submit" block>
          Sign In
        </Button>
      </Form>
    </Card>
  );
}
