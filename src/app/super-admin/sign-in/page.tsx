"use client";

import { theme } from "antd";

import cn from "@/lib/cn";
import LoginForm from "./_components/login-form";

export default function SignInPage() {
  const { token } = theme.useToken();

  return (
    <div
      className={cn(
        "w-full min-h-screen flex items-center justify-center",
        `bg-[${token.colorBgBase}]`,
      )}
    >
      <LoginForm />
    </div>
  );
}
