"use client";

import Link from "next/link";
import { Button, Result } from "antd";

import { TENANT_DASHBOARD_PATH } from "@/lib/auth/permissions";

export default function AccessDenied({
  title = "Access denied",
  subtitle = "Your current role does not include permission for this area.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <Result
      status="403"
      title={title}
      subTitle={subtitle}
      extra={
        <Link href={TENANT_DASHBOARD_PATH}>
          <Button type="primary">Back to dashboard</Button>
        </Link>
      }
    />
  );
}
