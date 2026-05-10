import type { SystemUserType } from "@/lib/api/types";

export const ADMIN_DASHBOARD_PATH = "/super-admin/dashboard";
export const TENANT_DASHBOARD_PATH = "/admin/dashboard";
export const SIGN_IN_PATH = "/sign-in";

export type RbacFeature =
  | "BUSINESS"
  | "EMPLOYEE_MANAGEMENT"
  | "ROLE_PERMISSION_MANAGEMENT";

export type PermissionAction = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type PermissionRequirement = {
  feature: RbacFeature;
  action: PermissionAction;
};

export type RoutePermission = PermissionRequirement | "DENY" | null;

export const PERMISSIONS = {
  businessRead: { feature: "BUSINESS", action: "READ" },
  employeeCreate: { feature: "EMPLOYEE_MANAGEMENT", action: "CREATE" },
  employeeRead: { feature: "EMPLOYEE_MANAGEMENT", action: "READ" },
  employeeUpdate: { feature: "EMPLOYEE_MANAGEMENT", action: "UPDATE" },
  employeeDelete: { feature: "EMPLOYEE_MANAGEMENT", action: "DELETE" },
  roleCreate: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "CREATE" },
  roleRead: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "READ" },
  roleUpdate: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "UPDATE" },
  roleDelete: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "DELETE" },
} satisfies Record<string, PermissionRequirement>;

export function getDashboardPath(userType?: SystemUserType | null) {
  return userType === "ADMIN" ? ADMIN_DASHBOARD_PATH : TENANT_DASHBOARD_PATH;
}

export function isDashboardUserType(userType?: SystemUserType | null) {
  return userType === "TENANT" || userType === "EMPLOYEE";
}

export function isPrivilegedDashboardUser(userType?: SystemUserType | null) {
  return userType === "ADMIN" || userType === "TENANT";
}

export function isSafeInternalPath(path?: string | null) {
  return Boolean(path?.startsWith("/") && !path.startsWith("//"));
}

export function getAdminRoutePermission(pathname: string): RoutePermission {
  if (!pathname.startsWith(TENANT_DASHBOARD_PATH)) return null;
  if (pathname === TENANT_DASHBOARD_PATH) return null;

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/business`)) {
    return PERMISSIONS.businessRead;
  }

  const usersPath = `${TENANT_DASHBOARD_PATH}/users-permission/users`;
  if (pathname.startsWith(`${usersPath}/create-user`)) {
    return PERMISSIONS.employeeCreate;
  }
  if (pathname.startsWith(`${usersPath}/edit-user`)) {
    return PERMISSIONS.employeeUpdate;
  }
  if (pathname.startsWith(usersPath)) {
    return PERMISSIONS.employeeRead;
  }

  const rolesPath = `${TENANT_DASHBOARD_PATH}/users-permission/roles`;
  if (pathname.startsWith(`${rolesPath}/create`)) {
    return PERMISSIONS.roleCreate;
  }
  if (pathname.startsWith(`${rolesPath}/edit`)) {
    return PERMISSIONS.roleUpdate;
  }
  if (pathname.startsWith(rolesPath)) {
    return PERMISSIONS.roleRead;
  }

  const permissionPath = `${TENANT_DASHBOARD_PATH}/users-permission/permission`;
  if (pathname.startsWith(`${permissionPath}/create`)) {
    return PERMISSIONS.roleCreate;
  }
  if (pathname.startsWith(`${permissionPath}/edit`)) {
    return PERMISSIONS.roleUpdate;
  }
  if (pathname.startsWith(permissionPath)) {
    return PERMISSIONS.roleRead;
  }

  return "DENY";
}
