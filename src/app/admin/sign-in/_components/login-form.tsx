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
import { LoginFormValues } from "../schemas";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useSwal } from "@/hooks/use-swal";

const { Link } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormValues>();
  const { login, loading } = useAuthStore();
  const router = useRouter();
  const swal = useSwal();

  const { handler } = useSubmit<LoginFormValues>(async (values) => {
    const { username, password } = values;
    await login(username, password);
    swal.success("Logged in successfully");
    router.push("/admin/dashboard");
  });

  return (
    <Card style={{ width: "full" }}>
      <Form<LoginFormValues>
        form={form}
        layout="vertical"
        onFinish={handler}
        initialValues={{ remember: true }}
      >
        <Form.Item<LoginFormValues>
          label="username"
          name="username"
          rules={[
            { required: true, message: "username is required" },
            { type: "email", message: "Invalid username address" },
          ]}
        >
          <Input placeholder="example@username.com" />
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
