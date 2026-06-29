import type {
  PermissionAction,
  RbacFeature,
  SystemUserType,
} from "@/lib/api/types";

export const ADMIN_DASHBOARD_PATH = "/super-admin/dashboard";
export const TENANT_DASHBOARD_PATH = "/admin/dashboard";
export const SIGN_IN_PATH = "/sign-in";

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
  productCatalogCreate: { feature: "PRODUCT_MANAGEMENT", action: "CREATE" },
  productCatalogRead: { feature: "PRODUCT_MANAGEMENT", action: "READ" },
  productCatalogUpdate: { feature: "PRODUCT_MANAGEMENT", action: "UPDATE" },
  productCatalogDelete: { feature: "PRODUCT_MANAGEMENT", action: "DELETE" },
  supplierCreate: { feature: "SUPPLIER_MANAGEMENT", action: "CREATE" },
  supplierRead: { feature: "SUPPLIER_MANAGEMENT", action: "READ" },
  supplierUpdate: { feature: "SUPPLIER_MANAGEMENT", action: "UPDATE" },
  supplierDelete: { feature: "SUPPLIER_MANAGEMENT", action: "DELETE" },
  inventoryCreate: { feature: "INVENTORY_MANAGEMENT", action: "CREATE" },
  inventoryRead: { feature: "INVENTORY_MANAGEMENT", action: "READ" },
  inventoryUpdate: { feature: "INVENTORY_MANAGEMENT", action: "UPDATE" },
  inventoryDelete: { feature: "INVENTORY_MANAGEMENT", action: "DELETE" },
  orderCreate: { feature: "ORDER_MANAGEMENT", action: "CREATE" },
  orderRead: { feature: "ORDER_MANAGEMENT", action: "READ" },
  orderUpdate: { feature: "ORDER_MANAGEMENT", action: "UPDATE" },
  orderDelete: { feature: "ORDER_MANAGEMENT", action: "DELETE" },
  posCreate: { feature: "POS_MANAGEMENT", action: "CREATE" },
  paymentCreate: { feature: "PAYMENT_MANAGEMENT", action: "CREATE" },
  paymentRead: { feature: "PAYMENT_MANAGEMENT", action: "READ" },
  paymentUpdate: { feature: "PAYMENT_MANAGEMENT", action: "UPDATE" },
  paymentDelete: { feature: "PAYMENT_MANAGEMENT", action: "DELETE" },
  financeCreate: { feature: "FINANCE_MANAGEMENT", action: "CREATE" },
  financeRead: { feature: "FINANCE_MANAGEMENT", action: "READ" },
  financeUpdate: { feature: "FINANCE_MANAGEMENT", action: "UPDATE" },
  financeDelete: { feature: "FINANCE_MANAGEMENT", action: "DELETE" },
  websiteCreate: { feature: "WEBSITE_MANAGEMENT", action: "CREATE" },
  websiteRead: { feature: "WEBSITE_MANAGEMENT", action: "READ" },
  websiteUpdate: { feature: "WEBSITE_MANAGEMENT", action: "UPDATE" },
  websiteDelete: { feature: "WEBSITE_MANAGEMENT", action: "DELETE" },
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

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/pos`)) {
    return PERMISSIONS.posCreate;
  }

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/business`)) {
    return PERMISSIONS.businessRead;
  }

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/media`)) {
    return PERMISSIONS.mediaRead;
  }

  if (pathname.startsWith(`${TENANT_DASHBOARD_PATH}/billing`)) {
    return PERMISSIONS.packageRead;
  }

  const websiteBuilderPath = `${TENANT_DASHBOARD_PATH}/website-builder`;
  if (pathname.startsWith(websiteBuilderPath)) {
    if (pathname.includes("/create")) return PERMISSIONS.websiteCreate;
    if (
      pathname.includes("/edit/") ||
      pathname.includes("/section-editor") ||
      pathname.includes("/page-builder") ||
      pathname.includes("/menu-builder") ||
      pathname.includes("/domains") ||
      pathname.includes("/publish-setting")
    ) {
      return PERMISSIONS.websiteUpdate;
    }

    return PERMISSIONS.websiteRead;
  }

  const productCatalogPath = `${TENANT_DASHBOARD_PATH}/product-catalog`;
  if (pathname.startsWith(productCatalogPath)) {
    if (pathname.includes("/create")) return PERMISSIONS.productCatalogCreate;
    if (
      pathname.includes("/edit/") ||
      pathname.includes("/update/") ||
      pathname.includes("/variants/")
    ) {
      return PERMISSIONS.productCatalogUpdate;
    }

    return PERMISSIONS.productCatalogRead;
  }

  const inventoryPath = `${TENANT_DASHBOARD_PATH}/inventory`;
  if (pathname.startsWith(inventoryPath)) {
    if (pathname.includes("/create")) return PERMISSIONS.inventoryCreate;
    if (pathname.includes("/edit/") || pathname.includes("/update/")) {
      return PERMISSIONS.inventoryUpdate;
    }

    return PERMISSIONS.inventoryRead;
  }

  const suppliersPath = `${TENANT_DASHBOARD_PATH}/suppliers`;
  if (pathname.startsWith(suppliersPath)) {
    if (
      pathname.includes("/create") ||
      pathname.includes("/add-supplier-product") ||
      pathname.includes("/create-return") ||
      pathname.includes("/return-request/")
    ) {
      return PERMISSIONS.supplierCreate;
    }
    if (
      pathname.includes("/edit/") ||
      pathname.includes("/update/") ||
      pathname.includes("/update-s-product/")
    ) {
      return PERMISSIONS.supplierUpdate;
    }

    return PERMISSIONS.supplierRead;
  }

  const ordersPath = `${TENANT_DASHBOARD_PATH}/orders`;
  if (pathname.startsWith(ordersPath)) {
    if (pathname.startsWith(`${ordersPath}/create`)) {
      return PERMISSIONS.orderCreate;
    }
    if (pathname.includes("/payments") || pathname.includes("/returns")) {
      return PERMISSIONS.orderUpdate;
    }

    return PERMISSIONS.orderRead;
  }

  const customersPath = `${TENANT_DASHBOARD_PATH}/customers`;
  if (pathname.startsWith(customersPath)) {
    if (pathname.includes("/create")) return PERMISSIONS.orderCreate;
    if (pathname.includes("/update/") || pathname.includes("/address/")) {
      return PERMISSIONS.orderUpdate;
    }

    return PERMISSIONS.orderRead;
  }

  const financePath = `${TENANT_DASHBOARD_PATH}/finance`;
  if (pathname.startsWith(financePath)) {
    if (pathname.includes("/create")) return PERMISSIONS.financeCreate;
    if (
      pathname.includes("/edit/") ||
      pathname.includes("/update/") ||
      pathname.includes("/pay")
    ) {
      return PERMISSIONS.financeUpdate;
    }

    return PERMISSIONS.financeRead;
  }

  const paymentGatewayPath = `${TENANT_DASHBOARD_PATH}/payment-gateway`;
  if (pathname.startsWith(paymentGatewayPath)) {
    if (pathname.includes("/create")) return PERMISSIONS.paymentCreate;
    if (pathname.includes("/edit/")) {
      return PERMISSIONS.paymentUpdate;
    }

    return PERMISSIONS.paymentRead;
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
