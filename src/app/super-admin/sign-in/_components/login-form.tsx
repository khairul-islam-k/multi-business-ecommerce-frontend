"use client";

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Flex,
  message,
} from "antd";

import useSubmit from "@/hooks/use-submit";
import Logo from "@/components/shared/logo";
import { LoginFormValues } from "../schemas";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { use } from "react";
import { AuthContext } from "@/providers/auth-provider";

const { Title, Text, Link } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const router = useRouter();
  const { setAccessToken, setRefreshToken } = use(AuthContext);

  const login = async (values: LoginFormValues) => {
    try {
      const { email, password } = values;
      const response = await api
        .post("/auth/login", { email, password })
        .then((res) => res.data);
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      message.success("Successfully signed-in!");
      router.push("/super-admin/dashboard");
    } catch (e: any) {
      message.error(
        e?.message && e.message.includes("400")
          ? "Invalid Credentials."
          : "Couldn't sign in. Try again later",
      );
    }
  };

  const { loading, handler } = useSubmit<LoginFormValues>(async (values) => {
    await login(values);
  });

  return (
    <Card style={{ width: 420 }}>
      <Flex vertical align="center" gap="small">
        <Logo />
        <Title level={3} style={{ margin: 0 }}>
          Super Admin Login
        </Title>
        <Text type="secondary">Sign in to manage your platform</Text>
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
