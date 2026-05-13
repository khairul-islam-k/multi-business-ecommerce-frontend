import type {
  ApiId,
  BusinessQuery,
  EmployeeQuery,
  PermissionQuery,
  MediaQuery,
  RoleAssignmentQuery,
  RoleQuery,
  TenantQuery,
} from "@/lib/api/types";

export const apiQueryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  businesses: {
    all: ["businesses"] as const,
    list: (query?: BusinessQuery) => ["businesses", "list", query] as const,
    detail: (businessId: ApiId) =>
      ["businesses", "detail", businessId] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    list: (query?: TenantQuery) => ["tenants", "list", query] as const,
    detail: (tenantId: ApiId) => ["tenants", "detail", tenantId] as const,
  },
  employees: {
    all: (businessId: ApiId) => ["employees", businessId] as const,
    list: (businessId: ApiId, query?: EmployeeQuery) =>
      ["employees", businessId, "list", query] as const,
    detail: (businessId: ApiId, employeeId: ApiId) =>
      ["employees", businessId, "detail", employeeId] as const,
  },
  roles: {
    all: (businessId: ApiId) => ["roles", businessId] as const,
    list: (businessId: ApiId, query?: RoleQuery) =>
      ["roles", businessId, "list", query] as const,
    detail: (businessId: ApiId, roleId: ApiId) =>
      ["roles", businessId, "detail", roleId] as const,
    assignments: (businessId: ApiId, query?: RoleAssignmentQuery) =>
      ["roles", businessId, "assignments", query] as const,
  },
  permissions: {
    available: ["permissions", "available"] as const,
    list: (businessId: ApiId, query?: PermissionQuery) =>
      ["permissions", businessId, "list", query] as const,
    role: (businessId: ApiId, roleId: ApiId) =>
      ["permissions", businessId, "role", roleId] as const,
  },
  media: {
    all: (businessId: ApiId) => ["media", businessId] as const,
    list: (businessId: ApiId, query?: MediaQuery) =>
      ["media", businessId, "list", query] as const,
  },
};
