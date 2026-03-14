import LoginForm from "@/components/super-admin/login-form";
import { Flex } from "antd";

export default function SignInPage() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: "100svh",
        width: "100%",
      }}
    >
      <LoginForm />
    </Flex>
  );
}
