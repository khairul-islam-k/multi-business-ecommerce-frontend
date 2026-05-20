"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth.store";
import AccessDenied from "@/components/auth/access-denied";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import {
  getAdminRoutePermission,
  getDashboardPath,
  isSafeInternalPath,
  SIGN_IN_PATH,
} from "@/lib/auth/permissions";

export default function AuthGuard({
  redirectUrl,
  role,
  children,
}: {
  redirectUrl: string;
  role: "Admin" | "Tenant" | "Employee";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, initialized, user, loading } = useAuthStore();

  // const expectedTypes = useMemo(
  //   () =>
  //     role === "Admin"
  //       ? ["ADMIN"]
  //       : role === "Tenant"
  //         ? ["TENANT", "EMPLOYEE"]
  //         : ["EMPLOYEE"],
  //   [role],
  // );
  // const routePermission = useMemo(
  //   () => (role === "Tenant" ? getAdminRoutePermission(pathname) : null),
  //   [pathname, role],
  // );
  // const permissionAccess = usePermissionAccess(
  //   routePermission === "DENY" ? null : routePermission,
  // );

  // useEffect(() => {
  //   if (!initialized || loading) return;

  //   if (!accessToken) {
  //     const signInPath =
  //       isSafeInternalPath(redirectUrl) && redirectUrl !== "/super-admin/sign-in"
  //         ? redirectUrl
  //         : SIGN_IN_PATH;
  //     router.replace(
  //       `${signInPath}?redirect=${encodeURIComponent(pathname || getDashboardPath())}`,
  //     );
  //     return;
  //   }

  //   if (!user) return;

  //   if (!expectedTypes.includes(user.type)) {
  //     router.replace(getDashboardPath(user.type));
  //   }
  // }, [
  //   accessToken,
  //   expectedTypes,
  //   initialized,
  //   loading,
  //   pathname,
  //   redirectUrl,
  //   router,
  //   user,
  // ]);

  // if (!initialized || loading || !accessToken || !user) return null;

  // if (!expectedTypes.includes(user.type)) return null;

  // if (permissionAccess.loading) return null;

  // if (user.type === "EMPLOYEE" && routePermission === "DENY") {
  //   return <AccessDenied />;
  // }

  // if (!permissionAccess.allowed) {
    
  //   return <AccessDenied />;
  // }

  return <>{children}</>;
}
