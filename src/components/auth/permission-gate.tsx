"use client";

import { Spin } from "antd";
import type { ReactNode } from "react";

import AccessDenied from "@/components/auth/access-denied";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import type { PermissionRequirement } from "@/lib/auth/permissions";

export default function PermissionGate({
  permission,
  children,
  fallback,
  loadingFallback,
}: {
  permission?: PermissionRequirement | null;
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}) {
  const access = usePermissionAccess(permission);

  if (access.loading) {
    return (
      loadingFallback ?? (
        <div className="flex min-h-80 items-center justify-center">
          <Spin size="large" />
        </div>
      )
    );
  }

  if (!access.allowed) {
    return fallback ?? <AccessDenied />;
  }

  return <>{children}</>;
}
