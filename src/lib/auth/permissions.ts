import type { SystemUserType } from "@/lib/api/types";

export const ADMIN_DASHBOARD_PATH = "/super-admin/dashboard";
export const TENANT_DASHBOARD_PATH = "/admin/dashboard";
export const SIGN_IN_PATH = "/sign-in";

export type RbacFeature =
  | "BUSINESS_MANAGEMENT"
  | "EMPLOYEE_MANAGEMENT"
  | "MEDIA_MANAGEMENT"
  | "PACKAGE_MANAGEMENT"
  | "ROLE_PERMISSION_MANAGEMENT"
  | "PRODUCT_CATALOG_MANAGEMENT";

export type PermissionAction = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type PermissionRequirement = {
  feature: RbacFeature;
  action: PermissionAction;
};

export type RoutePermission = PermissionRequirement | "DENY" | null;

export const PERMISSIONS = {
  businessCreate: { feature: "BUSINESS_MANAGEMENT", action: "CREATE" },
  businessRead: { feature: "BUSINESS_MANAGEMENT", action: "READ" },
  businessUpdate: { feature: "BUSINESS_MANAGEMENT", action: "UPDATE" },
  businessDelete: { feature: "BUSINESS_MANAGEMENT", action: "DELETE" },
  employeeCreate: { feature: "EMPLOYEE_MANAGEMENT", action: "CREATE" },
  employeeRead: { feature: "EMPLOYEE_MANAGEMENT", action: "READ" },
  employeeUpdate: { feature: "EMPLOYEE_MANAGEMENT", action: "UPDATE" },
  employeeDelete: { feature: "EMPLOYEE_MANAGEMENT", action: "DELETE" },
  mediaCreate: { feature: "MEDIA_MANAGEMENT", action: "CREATE" },
  mediaRead: { feature: "MEDIA_MANAGEMENT", action: "READ" },
  mediaUpdate: { feature: "MEDIA_MANAGEMENT", action: "UPDATE" },
  mediaDelete: { feature: "MEDIA_MANAGEMENT", action: "DELETE" },
  packageCreate: { feature: "PACKAGE_MANAGEMENT", action: "CREATE" },
  packageRead: { feature: "PACKAGE_MANAGEMENT", action: "READ" },
  packageUpdate: { feature: "PACKAGE_MANAGEMENT", action: "UPDATE" },
  packageDelete: { feature: "PACKAGE_MANAGEMENT", action: "DELETE" },
  roleCreate: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "CREATE" },
  roleRead: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "READ" },
  roleUpdate: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "UPDATE" },
  roleDelete: { feature: "ROLE_PERMISSION_MANAGEMENT", action: "DELETE" },
  productCatalogCreate: { feature: "PRODUCT_CATALOG_MANAGEMENT", action: "CREATE" },
  productCatalogRead: { feature: "PRODUCT_CATALOG_MANAGEMENT", action: "READ" },
  productCatalogUpdate: { feature: "PRODUCT_CATALOG_MANAGEMENT", action: "UPDATE" },
  productCatalogDelete: { feature: "PRODUCT_CATALOG_MANAGEMENT", action: "DELETE" },
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
  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/profile`)) return null;

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/business`)) {
    return PERMISSIONS.businessRead;
  }

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/media`)) {
    return PERMISSIONS.mediaRead;
  }

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/billing`)) {
    return PERMISSIONS.packageRead;
  }

  const employeesPath = `${TENANT_DASHBOARD_PATH}/access-control/employees`;
  if (pathname.startsWith(`${employeesPath}/create`)) {
    return PERMISSIONS.employeeCreate;
  }
  if (pathname.startsWith(`${employeesPath}/edit`)) {
    return PERMISSIONS.employeeUpdate;
  }
  if (pathname.startsWith(employeesPath)) {
    return PERMISSIONS.employeeRead;
  }

  const rolesPath = `${TENANT_DASHBOARD_PATH}/access-control/roles`;
  if (pathname.startsWith(`${rolesPath}/create`)) {
    return PERMISSIONS.roleCreate;
  }
  if (pathname.startsWith(`${rolesPath}/edit`)) {
    return PERMISSIONS.roleUpdate;
  }
  if (pathname.startsWith(rolesPath)) {
    return PERMISSIONS.roleRead;
  }

  const permissionsPath = `${TENANT_DASHBOARD_PATH}/access-control/permissions`;
  if (pathname.startsWith(`${permissionsPath}/create`)) {
    return PERMISSIONS.roleCreate;
  }
  if (pathname.startsWith(`${permissionsPath}/edit`)) {
    return PERMISSIONS.roleUpdate;
  }
  if (pathname.startsWith(permissionsPath)) {
    return PERMISSIONS.roleRead;
  }

  return "DENY";
}
