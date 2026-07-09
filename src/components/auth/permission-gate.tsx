"use client";

import type { ReactNode } from "react";

import AccessDenied from "@/components/auth/access-denied";
import Loader from "@/components/shared/loader";
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
        <Loader
          label="Checking permissions"
          description="Confirming your access for this business."
        />
      )
    );
  }

  if (!access.allowed) {
    return fallback ?? <AccessDenied />;
  }

  return <>{children}</>;
}
